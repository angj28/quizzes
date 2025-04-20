import * as attemptsDao from "./dao.js";
export default function AttemptRoutes(app) {
    app.get("/api/quizzes/:quizId/attempts/:studentId/last", async (req, res) => {
        const { quizId, studentId } = req.params;
        const lastAttempt = await attemptsDao.findLastAttempt(quizId, studentId);
        if (!lastAttempt) {
            return res.status(404).send({ error: "No attempts found for this student." });
        }
        res.json(lastAttempt);
    });

    app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
        const { quizId } = req.params;
        const { studentId, answers } = req.body;

        const quiz = await attemptsDao.getQuizDetails(quizId);
        const attemptsCount = await attemptsDao.countAttempts(quizId, studentId);

        if (attemptsCount >= quiz.maxAttempts) {
            return res.status(403).send({ error: "Maximum attempts reached." });
        }

        const score = await attemptsDao.calculateScore(quizId, answers);

        const newAttempt = {
            quizId,
            studentId,
            attemptNumber: attemptsCount + 1,
            answers,
            score,
            timestamp: new Date(),
        };
        const savedAttempt = await attemptsDao.saveAttempt(newAttempt);

        res.json(savedAttempt);
    });

    app.get("/api/quizzes/:qid/attempts/:uid", async (req, res) => {
        const attempts = await attemptsDao.findAttemptsForStudent(req.params.qid, req.params.uid);
        res.json(attempts);
      });
}