-- Users table seeds here (Example)
INSERT INTO users (name, email, password) VALUES ('Alice', 'AliceWonderland@fantasy.com', 'passowrd');
INSERT INTO users (name, email, password) VALUES ('Kira', 'KiraKnight@Actors.com', 'password');

INSERT INTO quizzes(user_id, title, isPrivate) VALUES (1, 'Basketball quiz', FALSE);
INSERT INTO quizzes(user_id, title, isPrivate) VALUES (2, 'Hockey quiz',FALSE);

INSERT INTO quiz_questions(quiz_id);
