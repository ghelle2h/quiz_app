-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quiz_answers CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS answer_attempts CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  isPrivate BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  question VARCHAR(255),
  answers VARCHAR(255)
);

CREATE TABLE quiz_answers (
  id SERIAL PRIMARY KEY NOT NULL,
  question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer VARCHAR(255) NOT NULL,
  isCorrect BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE quiz_attempts (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE answer_attempts (
  id SERIAL PRIMARY KEY NOT NULL,
  answer_id INTEGER REFERENCES quiz_answers(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_attemp_id INTEGER REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE
);
