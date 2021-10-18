// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");

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
app.use(express.urlencoded({ extended: true }));

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

app.get("/api/quizzes", (req, res) => {
  const sqlQuery = `
  SELECT quizzes.title, users.name
  FROM quizzes
  JOIN users ON users.id = user_id
  ;
  `
  db.query(sqlQuery)
    .then((dbRes) => res.json(dbRes.rows))
    .catch((err) => console.log(err));

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

app.post("/register", (req, res) => {
  const { name, email, password } = req.body
  console.log("session " + req.session.user_id);
  console.log("params " + req.params.user_id);
  const gotEmail = req.body.email;
  const gotPassword = req.body.password;

  if (!gotEmail || !gotPassword) {
    res.status(400).send("Invalid email or password!");
  }
  /*
    if (userEmailExists(gotEmail, users)) {
      res.status(400).send("Email is already registered!");
    }
  */
  const sqlQuery = `
  INSERT INTO
    users(name, email, password)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `
  db.query(sqlQuery, [name, email, password])
    .then(() => res.redirect("/quizzes"))
    .catch((err) => console.log(err));
});

// app.post("/new_quiz", (req, res) => {
//   const {title, description, isPrivate} = req.body
//   const user_id =
//   const sqlQuery = `
//   INSERT INTO
//     quizzes(title, description, isPrivate)
//   VALUES
//     ($1, $2, $3, $4)
//   RETURNING *
//   `
//   db.query(sqlQuery, [user_id, title, description, isPrivate])
//     .then(() => )
//     .catch((err) => console.log(err))
// })

// app.post("/new_question", (req, res) => {
//   const
// })



app.get("/", (req, res) => {

  res.redirect("/quizzes");

});

app.get("/quizzes", (req, res) => {
  const sqlQuery = `
  SELECT quizzes.title, users.name
  FROM quizzes
  JOIN users ON users.id = user_id
  ;
  `

  db.query(sqlQuery)
    .then((dbRes) => {
      const templateVars = {
        quizzes: dbRes.rows
      }
      res.render("index", templateVars)
      console.log(dbRes.rows);


    })
    .catch((err) => console.log(err));
})


app.get("/newquiz", (req, res) => {
  res.render("createQuiz");
});

app.post("/newquiz"), (req, res) => {

}

app.get("/login", (req, res) => {
  res.render("login");
});

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }
};

app.get("/register", (req, res) => {
  console.log("Gsession " + req.session.user_id);
  console.log("Gparams " + req.params.user_id);

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
        res.render("register");
      }
    })
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
