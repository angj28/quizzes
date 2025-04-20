import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}`
  );
  return response.data;
};
export const updateQuiz = async (quiz: any) => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quiz._id}`,
    quiz
  );
  return data;
};
export const findQuestionsForQuiz = async (quizId: any) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/questions`
  );
  return response.data;
};
export const deleteQuestion = async (questionId: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUESTIONS_API}/${questionId}`
  );
  return response.data;
};
export const updateQuestion = async (question: any) => {
  const { data } = await axiosWithCredentials.put(
    `${QUESTIONS_API}/${question._id}`,
    question
  );
  return data;
};
export const createQuestionForQuiz = async (quizId: string, question: any) => {
  const response = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question
  );
  return response.data;
};
export const getQuiz = async (quizId: any) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};
export const findAttemptsForQuizByStudent = async (
  quizId: any,
  uid: string
) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/attempts/${uid}`
  );
  return response.data;
};
export const createAttempt = async (
  quizId: string,
  attemptData: any,
  answers: any
) => {
  const response = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    {
      attemptData,
      answers,
    }
  );
  return response.data;
};

export const getResponses = async (quizId: string, attemptId: string) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/attempts/${attemptId}/responses`
  );
  return response.data;
};
