import Database from "../Database/index.js";
export function saveResponses(responses) {
  Database.responses = [...Database.responses, ...responses];
}
export function findResponsesForAttempt(attemptId) {
  const { responses } = Database;
  return responses.filter((response) => response.attemptId === attemptId);
}
