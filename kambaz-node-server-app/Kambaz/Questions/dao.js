import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
export function fetchAllQuestions() {
  return Database.questions;
}
export function findQuestionsForQuiz(quizId) {
  const { questions } = Database;
  return questions.filter((question) => question.quizId === quizId);
}
export function createQuestion(question) {
  const newQuestion = { ...question, _id: uuidv4() };
  Database.questions = [...Database.questions, newQuestion];
  return newQuestion;
}
export function deleteQuestion(questionId) {
  const { questions } = Database;
  Database.questions = questions.filter(
    (question) => question._id !== questionId
  );
}
export function updateQuestion(questionId, questionUpdate) {
  const { questions } = Database;
  const question = questions.find((question) => question._id === questionId);
  Object.assign(question, questionUpdate);
  return question;
}
