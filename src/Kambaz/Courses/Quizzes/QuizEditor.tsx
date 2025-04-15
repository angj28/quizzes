import React, { useState, useEffect } from "react";
import { Container, Nav, Row, Col, Card, Button, Badge } from "react-bootstrap";
import QuestionEditor from "./QuestionEditor";
import QuestionList from "./QuestionList";
import { v4 as uuidv4 } from "uuid";
import { Link, useParams } from "react-router";
import * as quizzesClient from "./client";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestion,
  deleteQuestion,
  setQuestions,
  updateQuestion,
} from "./questionReducer";

const QuizEditor: React.FC = () => {
  const { cid, qid } = useParams();
  const [activeTab, setActiveTab] = useState<"details" | "questions">(
    "questions"
  );
  const { questions } = useSelector((state: any) => state.questionsReducer);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [quizId, setQuizId] = useState<string>("Q101");
  const [quizTitle, setQuizTitle] = useState<string>("Rocket Propulsion Quiz");
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const dispatch = useDispatch();

  const fetchQuestions = async () => {
    try {
      const questions = await quizzesClient.findQuestionsForQuiz(qid as string);
      dispatch(setQuestions(questions));
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const points = questions.reduce((sum: any, q: any) => sum + q.points, 0);
    setTotalPoints(points);
  }, [questions]);

  const handleAddQuestion = () => {
    const newQuestion = {
      _id: uuidv4(),
      quizId: quizId,
      title: "Question " + (questions.length + 1),
      questionType: "multiple-choice",
      points: 10,
      questionText: "",
      choices: [
        { id: "A", text: "", isCorrect: true },
        { id: "B", text: "", isCorrect: false },
        { id: "C", text: "", isCorrect: false },
        { id: "D", text: "", isCorrect: false },
      ],
      orderInQuiz: questions.length,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    setEditingQuestion(newQuestion);
  };

  const handleEditQuestion = (questionId: string) => {
    const question = questions.find((q: any) => q._id === questionId);
    if (question) {
      setEditingQuestion({ ...question });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await quizzesClient.deleteQuestion(questionId);
      dispatch(deleteQuestion(questionId));

      // If currently editing this question, close editor
      if (editingQuestion && editingQuestion._id === questionId) {
        setEditingQuestion(null);
      }
    }
  };

  const handleSaveQuestion = async (question: any) => {
    if (!questions.some((q: any) => q._id === question._id)) {
      await quizzesClient.createQuestionForQuiz(qid as string, question);
      dispatch(addQuestion(question));
    } else {
      await quizzesClient.updateQuestion(question);
      dispatch(updateQuestion(question));
    }

    setEditingQuestion(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  const handleSaveQuiz = () => {
    // TODO: Implementation for saving the entire quiz
    alert("Quiz saved successfully!");
  };

  return (
    <Container fluid className="mt-3">
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>{quizTitle}</h2>
          </div>
        </Col>
        <h4>
          Points: <Badge bg="primary">{totalPoints}</Badge>
        </h4>
      </Row>

      <Row className="mb-3">
        <Col>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link
                active={activeTab === "details"}
                onClick={() => setActiveTab("details")}
                className={activeTab === "details" ? "active" : ""}
              >
                Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "questions"}
                onClick={() => setActiveTab("questions")}
                className={activeTab === "questions" ? "active" : ""}
              >
                Questions
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* Content */}
      <Row>
        <Col>
          {activeTab === "details" && (
            <Card>
              <Card.Body>
                <h3>Quiz Details</h3>
                {/* Quiz details form would go here */}
                <p>Quiz ID: {quizId}</p>
                <p>Quiz Title: {quizTitle}</p>
                <p>Total Questions: {questions.length}</p>
                <p>Total Points: {totalPoints}</p>
              </Card.Body>
            </Card>
          )}

          {activeTab === "questions" && (
            <>
              {!editingQuestion ? (
                <>
                  <div className="mb-3">
                    <Button
                      variant="outline-primary"
                      onClick={handleAddQuestion}
                    >
                      + New Question
                    </Button>
                  </div>

                  <QuestionList
                    questions={questions}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                </>
              ) : (
                <QuestionEditor
                  question={editingQuestion}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                />
              )}
            </>
          )}
        </Col>
      </Row>

      <Row className="mt-4 mb-5">
        <Col className="d-flex justify-content-between">
          <Link to={`/Kambaz/Courses/${cid}/Quizzes`}>
            <Button variant="outline-secondary">Cancel</Button>
          </Link>
          <Button variant="primary" onClick={handleSaveQuiz}>
            Save
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default QuizEditor;
