import Database from "../Database/index.js";
export function fetchAllQuizzes() {
  return Database.quizzes;
}
export function findQuizzesForCourse(courseId) {
  const { quizzes } = Database;
  return quizzes.filter((quiz) => quiz.course === courseId);
}
export function createQuiz(quiz) {
  const newQuiz = { ...quiz, _id: uuidv4() };
  Database.quizzes = [...Database.quizzes, newQuiz];
  return newQuiz;
}
export function deleteQuiz(quizId) {
  const { quizzes } = Database;
  Database.quizzes = quizzes.filter((quiz) => quiz._id !== quizId);
}
export function updateQuiz(quizId, quizUpdate) {
  const { quizzes } = Database;
  const quiz = quizzes.find((quiz) => quiz._id === quizId);
  Object.assign(quiz, quizUpdate);
  return quiz;
}
export function getQuiz(quizId) {
  const { quizzes } = Database;
  console.log("Looking for quizId:", quizId);
  console.log("All quizzes:", quizzes);
  const quiz = quizzes.find((quiz) => quiz._id === quizId);
  return quiz;
}
