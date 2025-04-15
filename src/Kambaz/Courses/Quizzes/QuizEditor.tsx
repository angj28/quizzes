import { useState, useEffect } from "react";
import { Container, Nav, Row, Col, Card, Button, Badge } from "react-bootstrap";
import QuestionEditor from "./QuestionEditor";
import QuestionList from "./QuestionList";
import { v4 as uuidv4 } from "uuid";
import { Link, useParams } from "react-router";
import * as quizzesClient from "./client";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "./questionReducer";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const [activeTab, setActiveTab] = useState<"details" | "questions">(
    "questions"
  );
  const { questions: originalQuestions } = useSelector(
    (state: any) => state.questionsReducer
  );
  const [draftQuestions, setDraftQuestions] = useState<any[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const dispatch = useDispatch();

  const fetchQuestions = async () => {
    try {
      const questions = await quizzesClient.findQuestionsForQuiz(qid as string);
      const quiz = await quizzesClient.getQuiz(qid);

      console.log("title: " + quiz.title);
      dispatch(setQuestions(questions));
      setDraftQuestions([...questions]);
      setQuizTitle(quiz.title);
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const points = draftQuestions.reduce(
      (sum: any, q: any) => sum + q.points,
      0
    );
    setTotalPoints(points);
  }, [draftQuestions]);

  const handleAddQuestion = () => {
    const newQuestion = {
      _id: uuidv4(),
      quizId: qid,
      title: "Question " + (draftQuestions.length + 1),
      questionType: "multiple-choice",
      points: 10,
      questionText: "",
      choices: [
        { id: "A", text: "", isCorrect: true },
        { id: "B", text: "", isCorrect: false },
        { id: "C", text: "", isCorrect: false },
        { id: "D", text: "", isCorrect: false },
      ],
      orderInQuiz: draftQuestions.length,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    setEditingQuestion(newQuestion);
  };

  const handleEditQuestion = (questionId: string) => {
    const question = draftQuestions.find((q: any) => q._id === questionId);
    if (question) {
      setEditingQuestion({ ...question });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setDraftQuestions(draftQuestions.filter((q) => q._id !== questionId));

      if (editingQuestion && editingQuestion._id === questionId) {
        setEditingQuestion(null);
      }
    }
  };

  const handleSaveQuestion = async (question: any) => {
    const updatedList = draftQuestions.map((q) =>
      q._id === question._id ? question : q
    );

    const isNew = !draftQuestions.find((q) => q._id === question._id);
    if (isNew) {
      setDraftQuestions([...draftQuestions, question]);
    } else {
      setDraftQuestions(updatedList);
    }

    setEditingQuestion(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  const handleSaveQuiz = async () => {
    const toCreate = draftQuestions.filter(
      (q) => !originalQuestions.find((oq: any) => oq._id === q._id)
    );

    const toUpdate = draftQuestions.filter((q) =>
      originalQuestions.find(
        (oq: any) =>
          oq._id === q._id && JSON.stringify(oq) !== JSON.stringify(q)
      )
    );

    const toDelete = originalQuestions.filter(
      (oq: any) => !draftQuestions.find((q) => q._id === oq._id)
    );

    try {
      await Promise.all([
        ...toCreate.map((q) =>
          quizzesClient.createQuestionForQuiz(qid as string, q)
        ),
        ...toUpdate.map((q) => quizzesClient.updateQuestion(q)),
        ...toDelete.map((q: any) => quizzesClient.deleteQuestion(q._id)),
      ]);

      // After syncing with server, re-fetch to update store
      fetchQuestions();
      alert("Quiz saved successfully!");
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
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
                <p>Quiz Title: {quizTitle}</p>
                <p>Total Questions: {draftQuestions.length}</p>
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
                    questions={draftQuestions}
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
}
