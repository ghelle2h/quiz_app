-- Users table seeds here (Example)
INSERT INTO users (name, email, password) VALUES ('Alice', 'AliceWonderland@fantasy.com', 'passowrd');
INSERT INTO users (name, email, password) VALUES ('Kira', 'KiraKnight@Actors.com', 'password');

INSERT INTO quizzes(user_id, title) VALUES (1, 'Basketball quiz');
INSERT INTO quizzes(user_id, title) VALUES (2, 'Hockey quiz');

INSERT INTO quiz_questions(quiz_id)
