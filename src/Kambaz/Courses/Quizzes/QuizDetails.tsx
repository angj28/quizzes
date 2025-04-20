import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import * as quizzesClient from "./client";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

export default function QuizAttempt() {
  const { cid, qid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [quiz, setQuiz] = useState<any | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [attemptsAllowed, setAttemptsAllowed] = useState([]);
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    try {
      const quizData = await quizzesClient.getQuiz(qid);
      const questions = await quizzesClient.findQuestionsForQuiz(qid);
      setQuiz(quizData);
      setTotalPoints(
        questions.reduce((sum: number, q: any) => sum + q.points, 0)
      );
      setAttemptsAllowed(quizData.attemptsAllowed);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const fetchQuestions = async () => {
    const data = await quizzesClient.findQuestionsForQuiz(qid);
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuiz();
    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        if (!currentUser?._id) return;
        const data = await quizzesClient.findAttemptsForQuizByStudent(
          qid,
          currentUser._id
        );
        setAttempts(data);
      } catch (err) {
        console.error("Error fetching attempts", err);
      }
    };

    fetchAttempts();
  }, [qid, currentUser]);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <Card.Body>
            <h3 className="mb-4">{quiz?.title}</h3>
            <hr className="my-2" />
            <div className="d-flex flex-wrap gap-4 align-items-center mb-3">
              <div>
                <strong>Due</strong>{" "}
                {quiz?.dueDate &&
                  new Date(quiz.dueDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                at{" "}
                {quiz?.dueDate &&
                  new Date(quiz.dueDate)
                    .toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })
                    .toLowerCase()}
              </div>

              <div>
                <strong>Points</strong> {totalPoints}
              </div>
              <div>
                <strong>Attempts</strong> {attempts.length} / {attemptsAllowed}
              </div>
              <div>
                <strong>Questions</strong> {questions.length}
              </div>

              <div>
                <strong>Available</strong>{" "}
                {quiz?.availableDate &&
                  new Date(quiz.availableDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                at{" "}
                {quiz?.availableDate &&
                  new Date(quiz.availableDate)
                    .toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })
                    .toLowerCase()}{" "}
                -{" "}
                {quiz?.untilDate &&
                  new Date(quiz.untilDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                at{" "}
                {quiz?.untilDate &&
                  new Date(quiz.untilDate)
                    .toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })
                    .toLowerCase()}
              </div>

              <div>
                <strong>Time Limit</strong> {quiz?.timeLimit} Minutes
              </div>
            </div>
            <hr className="my-2" />

            <div className="d-flex flex-column align-items-start mt-3">
              <div className="d-flex justify-content-center w-100">
                {quiz &&
                  currentUser &&
                  attempts.length < quiz.attemptsAllowed && (
                    <Button
                      variant="danger"
                      className="mb-4"
                      onClick={() =>
                        navigate(
                          `/Kambaz/Courses/${cid}/Quizzes/${qid}/attempt`
                        )
                      }
                    >
                      Start Quiz
                    </Button>
                  )}
              </div>
              <h5 className="mb-2">Attempt History</h5>
              {attempts.length > 0 ? (
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>Attempt</th>
                      <th>Score</th>
                      <th>Time Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt: any, index: number) => (
                      <tr key={index}>
                        <td
                          className={
                            index === attempts.length - 1
                              ? "text-uppercase fw-bold"
                              : ""
                          }
                        >
                          {index === attempts.length - 1 ? (
                            <Link
                              to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/attempt/${attempt._id}`}
                            >
                              Latest
                            </Link>
                          ) : (
                            `Attempt ${index + 1}`
                          )}
                        </td>
                        <td>
                          {attempt.score} out of {totalPoints}
                        </td>
                        <td>
                          {new Date(attempt.startTime).toLocaleString(
                            undefined,
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No attempts yet.</p>
              )}
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Container>
  );
}
