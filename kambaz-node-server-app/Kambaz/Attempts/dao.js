import Database from "../Database/index.js";
import * as questionsDao from "../Questions/dao.js";
import { v4 as uuidv4 } from "uuid";
export function fetchAllAttempts() {
  return Database.attempts;
}
export function findAttemptsForQuiz(quizId) {
  const { attempts } = Database;
  return attempts.filter((attempt) => attempt.quizId === quizId);
}
export function findAttemptsForStudent(quizId, studentId) {
  const { attempts } = Database;
  return attempts.filter(
    (attempt) => attempt.quizId === quizId && attempt.userId === studentId
  );
}
export function createAttempt(attempt) {
  const newAttempt = { ...attempt, _id: uuidv4(), timestamp: new Date() };
  Database.attempts = [...Database.attempts, newAttempt];
  return newAttempt;
}
export function deleteAttempt(attemptId) {
  const { attempts } = Database;
  Database.attempts = attempts.filter((attempt) => attempt._id !== attemptId);
}
export function getLastAttempt(quizId, studentId) {
  const studentAttempts = findAttemptsForStudent(quizId, studentId);
  if (studentAttempts.length === 0) return null;

  return studentAttempts.reduce((latest, current) => {
    return new Date(current.timestamp) > new Date(latest.timestamp)
      ? current
      : latest;
  });
}
export function countAttempts(quizId, studentId) {
  const studentAttempts = findAttemptsForStudent(quizId, studentId);
  return studentAttempts.length;
}
export function getAttempt(attemptId) {
  const { attempts } = Database;
  return attempts.find((attempt) => attempt._id === attemptId);
}
export function calculateScore(quizId, answers) {
  const questions = questionsDao.findQuestionsForQuiz(quizId);
  let totalScore = 0;

  for (const question of questions) {
    const userAnswer = answers[question._id];
    let isCorrect = false;

    switch (question.questionType) {
      case "multiple-choice":
        const correctChoice = question.choices.find((c) => c.isCorrect);
        isCorrect = userAnswer === correctChoice?.id;
        break;

      case "true-false":
        isCorrect = userAnswer === question.isTrue;
        break;

      case "fill-in-blank":
        if (userAnswer && question.correctAnswers) {
          if (question.caseSensitive) {
            isCorrect = question.correctAnswers.includes(userAnswer);
          } else {
            isCorrect = question.correctAnswers.some(
              (ans) => ans.toLowerCase() === userAnswer.toLowerCase()
            );
          }
        }
        break;

      default:
        break;
    }

    if (isCorrect) {
      totalScore += question.points || 0;
    }
  }

  return totalScore;
}
