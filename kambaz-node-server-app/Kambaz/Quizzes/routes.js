import * as quizzesDao from "./dao.js";
import * as questionsDao from "../Questions/dao.js";
export default function QuizRoutes(app) {
  app.delete("/api/quizzes/:quizId", async (req, res) => {
    const { quizId } = req.params;
    const status = await quizzesDao.deleteQuiz(quizId);
    res.send(status);
  });
  app.put("/api/quizzes/:quizId", async (req, res) => {
    const { quizId } = req.params;
    const quizUpdates = req.body;
    const status = await quizzesDao.updateQuiz(quizId, quizUpdates);
    res.send(status);
  });
  app.get("/api/quizzes/:quizId/questions", (req, res) => {
    const { quizId } = req.params;
    const questions = questionsDao.findQuestionsForQuiz(quizId);
    res.json(questions);
  });
  app.post("/api/quizzes/:quizId/questions", (req, res) => {
    const { quizId } = req.params;
    const question = {
      ...req.body,
      quizId: quizId,
    };
    const newQuestion = questionsDao.createQuestion(question);
    res.send(newQuestion);
  });
}
