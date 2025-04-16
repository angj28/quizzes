import { useState, useEffect } from "react";
import {
  Container,
  Nav,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
} from "react-bootstrap";
import QuestionEditor from "./QuestionEditor";
import QuestionList from "./QuestionList";
import { v4 as uuidv4 } from "uuid";
import { Link, useParams } from "react-router";
import * as quizzesClient from "./client";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "./questionReducer";
import { updateQuiz } from "./reducer";
import { FaPencilAlt } from "react-icons/fa";
import DeleteQuestionModal from "./DeleteQuestionModal";

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
  const [quiz, setQuiz] = useState<any | null>(null);

  const [editingTitle, setEditingTitle] = useState(false);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const dispatch = useDispatch();

  const fetchQuestions = async () => {
    try {
      const questions = await quizzesClient.findQuestionsForQuiz(qid as string);
      const quiz = await quizzesClient.getQuiz(qid);

      console.log("title: " + quiz.title);
      setQuiz(quiz);
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

  const saveTitle = async () => {
    const updatedQuiz = {
      ...quiz,
      title: quizTitle,
    };
    await quizzesClient.updateQuiz(updatedQuiz);
    dispatch(updateQuiz(updatedQuiz));
    setEditingTitle(false);
  };

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

  const handleDeleteQuestion = (questionId: string) => {
    setQuestionToDelete(questionId);
    setShowDeleteModal(true);
  };

  const confirmDeleteQuestion = async (questionId: string) => {
    setDraftQuestions(draftQuestions.filter((q) => q._id !== questionId));

    if (editingQuestion && editingQuestion._id === questionId) {
      setEditingQuestion(null);
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
      await quizzesClient.updateQuiz({
        ...quiz,
        points: totalPoints,
      });
      dispatch(updateQuiz({ ...quiz, points: totalPoints }));

      fetchQuestions();
      setActiveTab("details");
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };

  return (
    <Container fluid className="mt-3">
      <Row className="mb-3">
        <Col>
          <div className="d-flex align-items-center mb-3">
            {editingTitle ? (
              <div className="d-flex w-100">
                <Form.Control
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  autoFocus
                  onBlur={saveTitle}
                  onKeyPress={(e) => e.key === "Enter" && saveTitle()}
                />
                <Button variant="primary" className="ms-2" onClick={saveTitle}>
                  Save
                </Button>
              </div>
            ) : (
              <>
                <h3 className="m-0 me-2">{quizTitle}</h3>
                <Button
                  variant="link"
                  className="p-0 text-decoration-none"
                  onClick={() => {
                    setQuizTitle(quizTitle);
                    setEditingTitle(true);
                  }}
                >
                  <FaPencilAlt className="text-primary" />
                </Button>
              </>
            )}
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
            <Card style={{ minWidth: "600px" }}>
              <Card.Body>
                <h3 className="me-5">Quiz Details</h3>
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
                  <div className="mb-3" style={{ minWidth: "600px" }}>
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
            </>
          )}
        </Col>
      </Row>
      {questionToDelete && (
        <DeleteQuestionModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          questionId={questionToDelete}
          deleteQuestion={confirmDeleteQuestion}
        />
      )}
    </Container>
  );
}
