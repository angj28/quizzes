// src/Kambaz/Courses/Quizzes/QuizPreview.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Badge, Button, Card, Container, Form, ListGroup } from "react-bootstrap";
import * as quizzesClient from "./client";
import { FaPencilAlt } from "react-icons/fa";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState<Date>(new Date());

  // Fetch quiz data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizData = await quizzesClient.getQuiz(qid as string);
        const questionData = await quizzesClient.findQuestionsForQuiz(qid as string);
        
        setQuiz(quizData);
        setQuestions(questionData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load quiz:", error);
      }
    };

    fetchQuizData();
  }, [qid]);

  // Handle answer selection
  const handleAnswerChange = (questionId: string, answer: any) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer
    });
  };

  // Navigation between questions
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Submit quiz and calculate score
  const handleSubmitQuiz = () => {
    let totalCorrectPoints = 0;
    let totalPoints = 0;
    
    questions.forEach(question => {
      totalPoints += question.points;
      
      // Check answer based on question type
      const userAnswer = userAnswers[question._id];
      let isCorrect = false;
      
      switch (question.questionType) {
        case "multiple-choice":
          if (userAnswer) {
            const correctChoice = question.choices.find((choice: any) => choice.isCorrect);
            isCorrect = userAnswer === correctChoice?.id;
          }
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
                (ans: string) => ans.toLowerCase() === userAnswer.toLowerCase()
              );
            }
          }
          break;
      }
      
      if (isCorrect) {
        totalCorrectPoints += question.points;
      }
    });
    
    setScore(totalCorrectPoints);
    setQuizSubmitted(true);
  };

  // Navigate to edit screen
  const handleEditQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/quizzes/${qid}/edit`);
  };

  if (loading) {
    return <Container className="mt-4">Loading quiz preview...</Container>;
  }

  return (
    <Container className="mt-4">
      <Alert variant="warning">
        <i className="fas fa-eye me-2"></i> This is a preview of the published version of the quiz
      </Alert>

      <div className="mb-3">
        Started: {startTime.toLocaleDateString()} at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>

      <h3>Quiz Instructions</h3>
      <hr />

      {!quizSubmitted ? (
        // Quiz taking view
        <>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Form.Check 
                type="checkbox" 
                disabled 
                label={`Question ${currentQuestionIndex + 1}`}
              />
              <Badge bg="primary">{questions[currentQuestionIndex]?.points || 0} pts</Badge>
            </Card.Header>
            <Card.Body>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: questions[currentQuestionIndex]?.questionText || "" 
                }} 
              />
              
              {renderQuestionByType(
                questions[currentQuestionIndex], 
                userAnswers, 
                handleAnswerChange
              )}
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between mb-4">
            <div>
              Quiz saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            {currentQuestionIndex === questions.length - 1 ? (
              <Button variant="primary" onClick={handleSubmitQuiz}>
                Submit Quiz
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                Next →
              </Button>
            )}
          </div>

          <Button 
            variant="outline-secondary" 
            className="d-flex align-items-center mb-4"
            onClick={handleEditQuiz}
          >
            <FaPencilAlt className="me-2" /> Keep Editing This Quiz
          </Button>

          <h4>Questions</h4>
          <ListGroup className="mb-4">
            {questions.map((_, index) => (
              <ListGroup.Item 
                key={index}
                action
                active={index === currentQuestionIndex}
                onClick={() => setCurrentQuestionIndex(index)}
                className="d-flex align-items-center"
              >
                <Badge 
                  bg="secondary" 
                  className="me-2"
                  pill
                >
                  {index + 1}
                </Badge>
                Question {index + 1}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      ) : (
        // Quiz results view
        <>
          <Alert variant="info">
            <h4>Quiz Results</h4>
            <p>Your Score: {score} out of {questions.reduce((sum, q) => sum + q.points, 0)} points</p>
          </Alert>
          
          <h5>Question Breakdown:</h5>
          <ListGroup className="mb-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question._id];
              const result = getQuestionResult(question, userAnswer);
              
              return (
                <ListGroup.Item 
                  key={question._id}
                  variant={result.isCorrect ? "success" : "danger"}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Question {index + 1}</strong>
                    </div>
                    <Badge bg={result.isCorrect ? "success" : "danger"}>
                      {result.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                  
                  <div 
                    className="my-2"
                    dangerouslySetInnerHTML={{ __html: question.questionText }}
                  />
                  
                  {!result.isCorrect && (
                    <div className="mt-2">
                      <small>
                        <strong>Your answer:</strong> {result.userAnswerDisplay}
                      </small>
                      <br />
                      <small>
                        <strong>Correct answer:</strong> {result.correctAnswerDisplay}
                      </small>
                    </div>
                  )}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          
          <div className="d-flex justify-content-between mb-4">
            <Button variant="primary" onClick={() => setQuizSubmitted(false)}>
              Retake Quiz
            </Button>
            
            <Button variant="outline-secondary" onClick={handleEditQuiz}>
              <FaPencilAlt className="me-2" /> Edit Quiz
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

// Helper function to render question based on type
function renderQuestionByType(
  question: any, 
  userAnswers: Record<string, any>, 
  handleAnswerChange: (id: string, answer: any) => void
) {
  if (!question) return null;
  
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
            id={`true-option`}
            label="True"
            name={`question-${question._id}`}
            checked={userAnswers[question._id] === true}
            onChange={() => handleAnswerChange(question._id, true)}
          />
          <Form.Check
            type="radio"
            id={`false-option`}
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
            placeholder="Your answer"
            value={userAnswers[question._id] || ""}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          />
        </Form>
      );
      
    default:
      return <div>Unsupported question type</div>;
  }
}

// Helper function to get question result details
function getQuestionResult(question: any, userAnswer: any) {
  let isCorrect = false;
  let userAnswerDisplay = userAnswer || "No answer";
  let correctAnswerDisplay = "";
  
  switch (question.questionType) {
    case "multiple-choice":
      const correctChoice = question.choices.find((choice: any) => choice.isCorrect);
      isCorrect = userAnswer === correctChoice?.id;
      userAnswerDisplay = question.choices.find((c: any) => c.id === userAnswer)?.text || "No answer";
      correctAnswerDisplay = correctChoice?.text || "No correct answer defined";
      break;
    
    case "true-false":
      isCorrect = userAnswer === question.isTrue;
      userAnswerDisplay = userAnswer === true ? "True" : userAnswer === false ? "False" : "No answer";
      correctAnswerDisplay = question.isTrue ? "True" : "False";
      break;
      
    case "fill-in-blank":
      if (question.caseSensitive) {
        isCorrect = question.correctAnswers.includes(userAnswer);
      } else {
        isCorrect = question.correctAnswers.some(
          (ans: string) => ans.toLowerCase() === (userAnswer || "").toLowerCase()
        );
      }
      correctAnswerDisplay = question.correctAnswers.join(" or ");
      break;
  }
  
  return { isCorrect, userAnswerDisplay, correctAnswerDisplay };
}
