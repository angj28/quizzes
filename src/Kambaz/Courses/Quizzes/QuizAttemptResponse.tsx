import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as quizzesClient from "./client";
import {
  Container,
  Alert,
  ListGroup,
  Card,
  Badge,
  Spinner,
  Button,
} from "react-bootstrap";

export default function QuizAttemptResponse() {
  const navigate = useNavigate();
  const { qid, aid } = useParams();
  const [responses, setResponses] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (qid && aid) {
          const [respData, questionData] = await Promise.all([
            quizzesClient.getResponses(qid, aid),
            quizzesClient.findQuestionsForQuiz(qid),
          ]);

          setResponses(respData);
          setQuestions(questionData);

          let score = 0;
          let maxScore = 0;
          questionData.forEach((q: any) => {
            maxScore += q.points;
            const resp = respData.find((r: any) => r.questionId === q._id);
            if (resp?.isCorrect) {
              score += resp.pointsEarned ?? 0;
            }
          });

          setScore(score);
          setTotalPoints(maxScore);
        }
      } catch (err) {
        console.error("Error fetching attempt data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [qid, aid]);

  const getResponseForQuestion = (questionId: string) =>
    responses.find((r) => r.questionId === questionId);

  const getResult = (question: any, userAnswer: any) => {
    let isCorrect = false;
    let userAnswerDisplay = userAnswer ?? "No answer";
    let correctAnswerDisplay = "";

    switch (question.questionType) {
      case "multiple-choice":
        const correctChoice = question.choices.find((c: any) => c.isCorrect);
        isCorrect = userAnswer === correctChoice?.id;
        userAnswerDisplay =
          question.choices.find((c: any) => c.id === userAnswer)?.text ||
          "No answer";
        correctAnswerDisplay = correctChoice?.text || "N/A";
        break;

      case "true-false":
        isCorrect = userAnswer === question.isTrue;
        userAnswerDisplay =
          userAnswer === true
            ? "True"
            : userAnswer === false
            ? "False"
            : "No answer";
        correctAnswerDisplay = question.isTrue ? "True" : "False";
        break;

      case "fill-in-blank":
        if (question.caseSensitive) {
          isCorrect = question.correctAnswers.includes(userAnswer);
        } else {
          isCorrect = question.correctAnswers.some(
            (ans: string) =>
              ans.toLowerCase() === (userAnswer || "").toLowerCase()
          );
        }
        correctAnswerDisplay = question.correctAnswers.join(" or ");
        break;
    }

    return { isCorrect, userAnswerDisplay, correctAnswerDisplay };
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p>Loading attempt results...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Alert variant="info">
        <h4>Quiz Results</h4>
        <p>
          Your Score: {score} out of {totalPoints} points
        </p>
      </Alert>

      <h5>Question Breakdown:</h5>
      <ListGroup className="mb-4">
        {questions.map((question, index) => {
          const response = getResponseForQuestion(question._id);
          const userAnswer =
            response?.selectedChoiceId ?? response?.answerText ?? null;
          const result = getResult(question, userAnswer);

          return (
            <ListGroup.Item
              key={question._id}
              variant={result.isCorrect ? "success" : "danger"}
              className="mb-3"
            >
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <strong>Question {index + 1}</strong>
                  <Badge bg="secondary">{question.points} pts</Badge>
                </Card.Header>
                <Card.Body>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: question.questionText,
                    }}
                  />

                  <div className="mt-3">
                    <Badge
                      bg={result.isCorrect ? "success" : "danger"}
                      className="mb-2"
                    >
                      {result.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                    <p>
                      <strong>Your answer:</strong> {result.userAnswerDisplay}
                    </p>
                    {!result.isCorrect && (
                      <p>
                        <strong>Correct answer:</strong>{" "}
                        {result.correctAnswerDisplay}
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <div className="d-flex justify-content-center mt-4">
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          ← Back to Quiz
        </Button>
      </div>
    </Container>
  );
}
