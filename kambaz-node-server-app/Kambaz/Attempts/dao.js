import Database from "../Database/index.js";
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
        (attempt) => attempt.quizId === quizId && attempt.studentId === studentId
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