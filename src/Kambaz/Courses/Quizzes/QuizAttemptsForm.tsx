import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, Alert, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as quizzesClient from "./client";

export default function QuizAttemptForm() {
  const { qid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [startTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const quizData = await quizzesClient.getQuiz(qid as string);
      const questionData = await quizzesClient.findQuestionsForQuiz(
        qid as string
      );
      setQuiz(quizData);
      setQuestions(questionData);
    };
    fetchData();
  }, [qid]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    let totalCorrect = 0;
    const answersForDb: any = [];

    questions.forEach((question) => {
      const userAnswer = userAnswers[question._id];
      let isCorrect = false;

      switch (question.questionType) {
        case "multiple-choice":
          const correctChoice = question.choices.find((c: any) => c.isCorrect);
          isCorrect = userAnswer === correctChoice?.id;
          break;
        case "true-false":
          isCorrect = userAnswer === question.isTrue;
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
          break;
      }

      if (isCorrect) {
        totalCorrect += question.points;
      }

      answersForDb.push({
        questionId: question._id,
        userAnswer,
      });
    });

    const endTime = new Date();
    const timeSpent = (endTime.getTime() - startTime.getTime()) / 60000; // in minutes

    const attemptData = {
      timeSpent: parseFloat(timeSpent.toFixed(2)),
      userId: currentUser._id,
      startTime,
      endTime,
      completed: true,
      score: totalCorrect,
    };

    try {
      await quizzesClient.createAttempt(qid!, attemptData, answersForDb);
      setScore(totalCorrect);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting attempt:", err);
    }
  };

  if (!quiz || questions.length === 0) {
    return <Container className="mt-4">Loading quiz...</Container>;
  }

  return (
    <Container className="mt-4">
      <h3>{quiz.title}</h3>

      {!submitted ? (
        <>
          {questions.map((question, index) => (
            <Card key={question._id} className="mb-4">
              <Card.Header>
                Question {index + 1}{" "}
                <Badge bg="secondary" className="ms-2">
                  {question.points} pts
                </Badge>
              </Card.Header>
              <Card.Body>
                <div
                  dangerouslySetInnerHTML={{ __html: question.questionText }}
                />
                {renderQuestionByType(
                  question,
                  userAnswers,
                  handleAnswerChange
                )}
              </Card.Body>
            </Card>
          ))}

          <div className="d-flex justify-content-end">
            <Button onClick={handleSubmit} variant="success">
              Submit Quiz
            </Button>
          </div>
        </>
      ) : (
        <>
          <Alert variant="info">
            <h4>Quiz Submitted!</h4>
            <p>
              You scored <strong>{score}</strong> out of{" "}
              <strong>{questions.reduce((sum, q) => sum + q.points, 0)}</strong>{" "}
              points.
            </p>
          </Alert>
          <Button onClick={() => navigate(-1)}>Back to Quiz</Button>
        </>
      )}
    </Container>
  );
}

function renderQuestionByType(
  question: any,
  userAnswers: Record<string, any>,
  handleAnswerChange: (id: string, answer: any) => void
) {
  switch (question.questionType) {
    case "multiple-choice":
      return (
        <Form>
          {question.choices.map((choice: any) => (
            <Form.Check
              key={choice.id}
              type="radio"
              id={`choice-${choice.id}`}
              label={choice.text}
              name={`question-${question._id}`}
              checked={userAnswers[question._id] === choice.id}
              onChange={() => handleAnswerChange(question._id, choice.id)}
            />
          ))}
        </Form>
      );

    case "true-false":
      return (
        <Form>
          <Form.Check
            type="radio"
            label="True"
            name={`question-${question._id}`}
            checked={userAnswers[question._id] === true}
            onChange={() => handleAnswerChange(question._id, true)}
          />
          <Form.Check
            type="radio"
            label="False"
            name={`question-${question._id}`}
            checked={userAnswers[question._id] === false}
            onChange={() => handleAnswerChange(question._id, false)}
          />
        </Form>
      );

    case "fill-in-blank":
      return (
        <Form>
          <Form.Control
            type="text"
            placeholder="Type your answer"
            value={userAnswers[question._id] || ""}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          />
        </Form>
      );

    default:
      return <div>Unsupported question type</div>;
  }
}
