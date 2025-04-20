import * as attemptsDao from "./dao.js";
import * as quizzesDao from "../Quizzes/dao.js";
import * as responsesDao from "../Responses/dao.js";
export default function AttemptRoutes(app) {
  app.get("/api/quizzes/:quizId/attempts/:studentId/last", async (req, res) => {
    const { quizId, studentId } = req.params;
    const lastAttempt = await attemptsDao.findLastAttempt(quizId, studentId);
    if (!lastAttempt) {
      return res
        .status(404)
        .send({ error: "No attempts found for this student." });
    }
    res.json(lastAttempt);
  });

  app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
    const { quizId } = req.params;
    const { attemptData, answers } = req.body;

    const quiz = await quizzesDao.getQuiz(quizId);
    const attemptsCount = await attemptsDao.countAttempts(
      quizId,
      attemptData.userId
    );

    if (attemptsCount >= quiz.maxAttempts) {
      return res.status(403).send({ error: "Maximum attempts reached." });
    }

    const newAttempt = {
      quizId,
      startTime: attemptData.startTime,
      userId: attemptData.userId,
      attemptNumber: attemptsCount + 1,
      score: attemptData.score,
      timestamp: new Date(),
    };

    const savedAttempt = await attemptsDao.createAttempt(newAttempt);
    await responsesDao.saveResponses(answers);

    res.json({ attempt: savedAttempt, answers });
  });

  app.get("/api/quizzes/:qid/attempts/:uid", async (req, res) => {
    const attempts = await attemptsDao.findAttemptsForStudent(
      req.params.qid,
      req.params.uid
    );
    res.json(attempts);
  });

  app.get("/api/quizzes/:qid/attempts/:aid/responses", async (req, res) => {
    console.log("im here");
    const { aid } = req.params;
    console.log("Fetching responses for attempt:", aid);
    const responses = await responsesDao.findResponsesForAttempt(aid);
    res.json(responses);
  });
}
