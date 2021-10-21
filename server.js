// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");


// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['QUIZZAPP'],
  maxAge: 24 * 60 * 60 * 1000,
}));


app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

//HELPER FUNCTION (to be moved into helper folder)
let newQuizId = undefined;
let newQuestionId = undefined;

const confirmUser = function (email, password) {
  return findUserByEmail(email)
    .then(function (res) {
      const userFound = res[0]
      if (!userFound) {
        return false
      };
      if (userFound) {
        const result = (password === userFound.password)
        if (!result) {
          return false;
        } else {
          return userFound
        }
      }
    })

};

const findUserByEmail = function (email) {
  const sqlQuery = `
    SELECT *
    FROM users
    WHERE email = $1;
    `

  return db.query(sqlQuery, [email])
    .then((dbRes) => dbRes.rows)
    .catch((err) => console.log(err));
};

app.get("/api/quizzes", (req, res) => {
  const sqlQuery = `
  SELECT *
  FROM quizzes
  ;
  `

  db.query(sqlQuery)
    .then((dbRes) => {
      const templateVars = {
        user: {
          name: undefined
        },
        quizzes: dbRes.rows
      }
      console.log("dbRes", dbRes)
      res.render("index", templateVars)
      console.log(dbRes.rows);

    });
  });

  app.get("/api/users", (req, res) => {
    const sqlQuery = `
  SELECT *
  FROM users
  ;
  `
  db.query(sqlQuery)
    .then((dbRes) => res.json(dbRes.rows))
    .catch((err) => console.log(err));
});

const userEmailExists = function (email, templateVar) {
  // templateVar.users.forEach(element => {
    for(let element of templateVar.users) {
      if (element["email"] === email) {
      console.log('true')
      return true;
    }
    }
  console.log('false')
  return false;


};
/*
const getSessionId = function (sqlQuery1, email) {
  let session_id = db.query(sqlQuery1)
    .then(data => {
      const templateVar = { users: data.rows };
      templateVar.users.forEach(element => {
        console.log(element["email"], email, element["id"]);
        if (element["email"] == email) {
          console.log(element["id"]);
          return element["id"];
        }
      });
    })

    .catch((err) => console.log(err))

  return session_id;
};
*/
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Invalid email or password!");
  }

  const sqlQuery1 = `SELECT * FROM users`;
  const sqlQuery = `
  INSERT INTO
    users(name, email, password)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;

  db.query(sqlQuery1)
    .then(data => {
      const templateVar = { users: data.rows, user_id: req.session.user_id };
      console.log(templateVar);
      console.log(email)
      if (userEmailExists(email, templateVar)) {
        res.status(400).send("Email is already registered!");
      } else {
        db.query(sqlQuery, [name, email, password])
          .then(data => {
            //req.session.user_id = getSessionId(sqlQuery1, email);
            db.query(sqlQuery1)
              .then(data => {
                const templateVar = { users: data.rows };
                templateVar.users.forEach(element => {
                  //       console.log(element["email"], email, element["id"]);
                  if (element["email"] == email) {
                    console.log(element["id"]);
                    req.session.user_id = element["id"];
                  }
                });
                console.log("POST got session " + req.session.user_id);
                res.redirect("/quizzes");
              })


          })
      }
    }
    )
    .catch((err) => console.log(err));
});

  app.post("/newquiz", (req, res) => {
    const {title, description, isPrivate} = req.body
    console.log(req.body.title)
    const user_id = req.session.user_id
    console.log(user_id)
    const sqlQuery = `
    INSERT INTO
      quizzes(user_id, title, description, isPrivate)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *
    `
    db.query(sqlQuery, [user_id, title, description, isPrivate])
      .then((dbRes) => {
      //   const {question} = req.body
        newQuizId = dbRes.rows[0].id
        res.redirect(`/new_question/${newQuizId}`)
          })
          .catch((err) => console.log(err))


      });

      app.get("/new_question/:quiz_id", (req, res) =>{
        const user = null
        const quiz_id = req.params.quiz_id
    const templateVars = {
      user,
      quiz_id
    }
    // console.log(quiz_id);

        res.render("quiz_questions", templateVars);
      })


  app.post("/new_question/:quiz_id", (req, res) => {
    const {question, quiz_id} = req.body

    console.log("quiz_id server side: ", quiz_id)

        const sqlQuery1 = `
        INSERT INTO
         quiz_questions(quiz_id, question)
        VALUES
          ($1, $2)
        RETURNING *
        ;
        `
    db.query(sqlQuery1, [quiz_id, question])
      .then((dbRes) => {
        newQuestionId = dbRes.rows[0].id;
            const {answer1, answer2, answer3, answer4} = req.body
            const sqlQuery2 = `
              INSERT INTO
                  quiz_answers(question_id, answer)
                    VALUES
                      ($1, $2), ($1, $3), ($1, $4), ($1, $5)
                    RETURNING *
                    ;
                    `
                  db.query(sqlQuery2, [newQuestionId, answer1, answer2, answer3, answer4])
                    .then((dbRes) => {
                      console.log(dbRes.rows[0])
                    })
          });
    res.send();

  })

  app.post(`/new_answers/:question_id`, (req, res) => {
    console.log(req.params)
    // const {answer1, answer2, answer3, answer4} = req.body
    //         const sqlQuery2 = `
    //         INSERT INTO
    //           quiz_answers(question_id, answer)
    //         VALUES
    //           ($1, $2), ($1, $3), ($1, $4), ($1, $5)
    //         RETURNING *
    //         ;
    //         `
    //       db.query(sqlQuery2, [newQuestionId, answer1, answer2, answer3, answer4])
    //         .then((dbRes) => {
    //           console.log(dbRes.rows[0])
    //         })
  })
  // app.post("/new_question", (req, res) => {
  //   const
  // }


  app.get("/", (req, res) => {
    // console.log('req.session', req.session)
    // const user = req.session.user_id

    // const templateVars = {
    //   user
    // }

    res.redirect("/quizzes");
  });

  app.get("/quizzes", (req, res) => {

    const sqlQuery = `
  SELECT quizzes.title
  FROM quizzes
  WHERE user_id = $1
  ;
  `
    const values = [req.session.user_id]
    db.query(sqlQuery, values)
      .then((dbRes) => {
        console.log("req.session.user_name:", req.session.user_name)
        console.log("req.session.user:", req.session.user_id)
        console.log("dbRes:", dbRes.rows)
        const templateVars = {
          quizzes: dbRes.rows,
          user: {
          id: req.session.user_id,
          name: req.session.user_name
          }
        }
        res.render("index", templateVars)
        console.log("deRes.rows:", dbRes.rows);


      })
      .catch((err) => console.log(err));
  })


  app.get("/newquiz", (req, res) => {
    const user = null
    const templateVars = {
      user
    }
    res.render("createQuiz", templateVars);
  });

  // app.post("/newquiz"), (req, res) => {

  // }

  app.get("/api/quiz/:quiz_id", (req, res) => {
    const sqlQuery = `
    SELECT * FROM quiz_questions
    JOIN quizzes ON quizzes.id = quiz_id
    WHERE quiz_id = 4;
    `
    db.query(sqlQuery)
      .then((dbRes) => res.json(dbRes.rows))
      .catch((err) => console.log(err))
  })
  // app.post(`/new_quiz/${newQuiz}`, (req, res) => {
  //   const {question, answer1, answer2, answer3, answer4} = req.body
  //   const sqlQuery = `
  //   INSERT INTO
  //     quiz_questions(quiz_id, question, answer)
  //   VALUES
  //     ($1, $2, $3), ($1, $2, $4), ($1, $2, $5)
  //   RETURNING *
  //   ;
  //   `
  //   db.query(sqlQuery, [newQuiz, question, answer1, answer2, answer3, answer4])
  //     .then(() => res.redirect("/api/newquiz"))
  //     .catch((err) => console.log(err))
  // })

  // app.get("/new_quiz/:quiz_id")

  app.get("/login", (req, res) => {
    const user = null
    const templateVars = {
      user
    }
    res.render("login", templateVars);
  });

  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    // use helper function to confirm that email is found in db, and if so, the password matches
    confirmUser(email, password)
    .then((user) => {
      console.log("user:", user)
          // if there is a user (true), then create a cookie, otherwise return error message
    if (user) {
      req.session.user_id = user.id;
      req.session.user_name = user.name
      res.redirect("/quizzes");
    } else {
      res.status(403).send('Status code 403: Login error. Please try again.');
    }
    })

  })

  app.post("/logout", (req, res) => {
    req.session = null;

    res.redirect("/");
  });

  app.get("/register", (req, res) => {
    const user = req.session.user_id
    const templateVars = {
      user
    }

    db.query(`
  SELECT * FROM users;`)
      .then(data => {
        const templateVar = { users: data.rows, user_id: req.session.user_id };
        //  console.log(templateVar);
        if (templateVar.users[0].id === req.session.user_id) {
          console.log("Already registered");
          res.render("register");
        } else {
          console.log("Register new user");
          res.render("register", templateVars);
        }
      })
  });

  app.get("/:quiz_id", (req, res) => {
    db
    res.render("quiz", templateVars);
  });



  app.get("/:user_id/:quiz_id/results", (req, res) => {
    res.render("results")
  })


  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });

  // SELECT title, description, id
  // midterm-> FROM quizzes
  // midterm-> WHERE id = 2;

