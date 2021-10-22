-- Users table seeds here (Example)
INSERT INTO users (name, email, password) VALUES ('Alice', 'AliceWonderland@fantasy.com', 'passowrd');
INSERT INTO users (name, email, password) VALUES ('Kira', 'KiraKnight@Actors.com', 'password');


INSERT INTO quizzes(user_id, title, isPrivate) VALUES (1, 'Basketball quiz', FALSE);
INSERT INTO quizzes(user_id, title, isPrivate) VALUES (2, 'Hockey quiz',FALSE);
INSERT INTO quizzes(user_id, title, description, isPrivate) VALUES (2, 'National Animal quiz', 'Test your knowledge on National Animals', FALSE);


INSERT INTO quiz_questions(quiz_id, question)
             VALUES (1, 'How many points is a three pointer');
INSERT INTO quiz_questions(quiz_id, question)
            VALUES (1, 'How many points is a layup');
INSERT INTO quiz_questions(quiz_id, question)
            VALUES (1, 'How many points is a half-court shot');

INSERT INTO quiz_questions(quiz_id, question)
            VALUES (3, 'Which country''s national animal is a bald eagle');
INSERT INTO quiz_questions(quiz_id, question)
            VALUES (3, 'Which country''s national animal is a lion');
INSERT INTO quiz_questions(quiz_id, question)
            VALUES (3, 'Which country''s national animal is a tiger');


INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (1, 3, TRUE);     --BB id:1
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (1, 2, FALSE);    --BB id:2
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (1, 1, FALSE);    --BB id:3

INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (2, 2, TRUE);       --BB id:4
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (2, 1, FALSE);      --BB id:5
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (2, 3, FALSE);      --BB id:6

INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (3, 3, TRUE);       --BB id:7
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (3, 1, FALSE);      --BB id:8
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (3, 4, FALSE);      --BB id:9

INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (4, 1, TRUE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (4, 2, FALSE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (4, 3, FALSE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (4, 4, FALSE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (5, 1, TRUE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (5, 2, FALSE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (5, 3, FALSE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (5, 4, FALSE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (6, 1, FALSE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (6, 2, TRUE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (6, 3, FALSE);
INSERT INTO quiz_answers(question_id, answer, isCorrect) VALUES (6, 4, FALSE);

INSERT INTO quiz_attempts (quiz_id, user_id) VALUES (3, 2);

--INSERT INTO answer_attempts(answer_id, user_id) VALUES (1, 1);
--INSERT INTO answer_attempts(answer_id, user_id) VALUES (2, 1);

INSERT INTO answer_attempts(answer_id, user_id, quiz_attempt_id, question_id) VALUES (10, 2, 1, 4); --TRUE
INSERT INTO answer_attempts(answer_id, user_id, quiz_attempt_id, question_id) VALUES (15, 2, 1, 5); --FALSE
INSERT INTO answer_attempts(answer_id, user_id, quiz_attempt_id, question_id) VALUES (19, 2, 1, 6); --TRUE

