import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import { deleteQuiz, setQuizzes, updateQuiz } from "./reducer";
import { useEffect, useState } from "react";
import {
  ListGroup,
  Button,
  Dropdown,
  DropdownButton,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import { FaCheck, FaBan } from "react-icons/fa";
import ProtectedFaculty from "../../ProtectedFaculty";
import DeleteModal from "./DeleteModal";

export default function Quizzes() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("New Quiz");

  const fetchQuizzes = async () => {
    const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz: any) => {
        const questions = await quizzesClient.findQuestionsForQuiz(quiz._id);
        return {
          ...quiz,
          questions,
        };
      })
    );

    dispatch(setQuizzes(quizzesWithStats));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const deleteThisQuiz = async (quizId: string) => {
    await quizzesClient.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
    handleClose();
  };

  const handleShow = (quizId: string) => {
    setSelectedQuizId(quizId);
  };

  const handleClose = () => {
    setSelectedQuizId(null);
  };

  const handleAddQuiz = () => {
    setNewQuizTitle("New Quiz");
    setShowTitleModal(true);
  };

  const createQuiz = async () => {
    const newQuiz = {
      title: newQuizTitle,
      courseId: cid,
      published: false,
      questions: [],
      availableDate: new Date(),
      availableUntilDate: new Date(),
      dueDate: new Date(),
      points: 0,
    };
    const createdQuiz = await coursesClient.createQuizForCourse(
      cid as string,
      newQuiz
    );
    await fetchQuizzes();
    setShowTitleModal(false);
    navigate(`/Kambaz/Courses/${cid}/quizzes/${createdQuiz._id}/edit`);
  };

  const handlePublishToggle = async (quiz: any) => {
    try {
      const updatedQuiz = {
        ...quiz,
        published: !quiz.published,
        updatedAt: new Date().toISOString(),
      };
      await quizzesClient.updateQuiz(updatedQuiz);
      dispatch(updateQuiz(updatedQuiz));
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };

  const getQuizAvailabilityStatus = (quiz: any) => {
    const currentDate = new Date();
    const availableDate = new Date(quiz.availableDate);
    const availableUntilDate = new Date(quiz.dueDate);
    console.log("quiz: ", quiz._id);
    console.log("available: ", availableDate);
    console.log("available until: ", availableUntilDate);

    if (currentDate < availableDate) {
      return `Not available until ${availableDate.toLocaleDateString()} at ${availableDate.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}`;
    } else if (
      currentDate >= availableDate &&
      currentDate <= availableUntilDate
    ) {
      return "Available";
    } else {
      return "Closed";
    }
  };

  const handleQuizAction = (action: string, quiz: any) => {
    switch (action) {
      case "edit":
        navigate(`/Kambaz/Courses/${cid}/quizzes/${quiz._id}/edit`);
        break;
      case "delete":
        handleShow(quiz._id);
        break;
      case "publish":
        handlePublishToggle(quiz);
        break;
      default:
        break;
    }
  };

  const isQuizAttempted = (quiz: any) => {
    return quiz.hasOwnProperty("studentScore");
  };

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Quizzes</h3>
        <ProtectedFaculty studentAccess={<></>}>
          <Button
            variant="danger"
            className="rounded-pill"
            onClick={handleAddQuiz}
          >
            Add Quiz
          </Button>
        </ProtectedFaculty>
      </div>
      {quizzes.length === 0 ? (
        <div className="alert alert-info">
          No quizzes available. Click the "Add Quiz" button to create a new
          quiz.
        </div>
      ) : (
        <ListGroup className="wd-quizzes">
          {quizzes.map((quiz: any) => (
            <ProtectedFaculty
              studentAccess={
                quiz.published ? (
                  <ListGroup.Item key={quiz._id} className="wd-quiz p-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <div
                          className="fw-bold mb-1"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(
                              `/Kambaz/Courses/${cid}/quizzes/${quiz._id}`
                            )
                          }
                        >
                          {quiz.title}
                        </div>

                        <div className="small text-muted">
                          <span className="me-3">
                            {getQuizAvailabilityStatus(quiz)}
                          </span>
                          {quiz.dueDate && (
                            <span className="me-3">
                              Due {new Date(quiz.dueDate).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(quiz.dueDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                          <span className="me-3">{quiz.points || 0} pts</span>
                          <span className="me-3">
                            {quiz.questions ? quiz.questions.length : 0}{" "}
                            Questions
                          </span>
                          {isQuizAttempted(quiz) && (
                            <span className="ms-3">
                              <Badge bg="success">
                                Score: {quiz.studentScore}/{quiz.points}
                              </Badge>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ) : (
                  <></>
                )
              }
            >
              <ListGroup.Item key={quiz._id} className="wd-quiz p-3">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-5 text-secondary" />

                  <div
                    className="me-3"
                    onClick={() => handlePublishToggle(quiz)}
                  >
                    {quiz.published ? (
                      <FaCheck
                        className="text-success fs-5"
                        title="Published"
                      />
                    ) : (
                      <FaBan
                        className="text-secondary fs-5"
                        title="Unpublished"
                      />
                    )}
                  </div>

                  <div className="flex-grow-1">
                    <div
                      className="fw-bold mb-1"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(
                          `/Kambaz/Courses/${cid}/quizzes/${quiz._id}/edit`
                        )
                      }
                    >
                      {quiz.title}
                    </div>

                    <div className="small text-muted">
                      <span className="me-3">
                        {getQuizAvailabilityStatus(quiz)}
                      </span>
                      {quiz.dueDate && (
                        <span className="me-3">
                          Due {new Date(quiz.dueDate).toLocaleDateString()} at{" "}
                          {new Date(quiz.dueDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                      <span className="me-3">{quiz.points || 0} pts</span>
                      <span className="me-3">
                        {quiz.questions ? quiz.questions.length : 0} Questions
                      </span>
                    </div>
                  </div>
                  <DropdownButton
                    align="end"
                    variant="light"
                    title={<BsThreeDotsVertical />}
                    className="bg-transparent border-0"
                  >
                    <Dropdown.Item
                      onClick={() => handleQuizAction("edit", quiz)}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleQuizAction("delete", quiz)}
                    >
                      Delete
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleQuizAction("publish", quiz)}
                    >
                      {quiz.published ? "Unpublish" : "Publish"}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        navigate(
                          `/Kambaz/Courses/${cid}/quizzes/${quiz._id}/preview`
                        )
                      }
                    >
                      Preview
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
              </ListGroup.Item>
            </ProtectedFaculty>
          ))}
        </ListGroup>
      )}

      <DeleteModal
        show={selectedQuizId !== null}
        handleClose={handleClose}
        quizId={selectedQuizId || ""}
        deleteThisQuiz={deleteThisQuiz}
        message="Are you sure you want to delete this quiz?"
      />
      <Modal show={showTitleModal} onHide={() => setShowTitleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Quiz Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter quiz title"
                value={newQuizTitle}
                onChange={(e) => setNewQuizTitle(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTitleModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createQuiz}>
            Create Quiz
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
