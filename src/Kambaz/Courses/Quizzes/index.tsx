import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import { deleteQuiz, setQuizzes } from "./reducer";
import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical, BsJournals } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import ProtectedFaculty from "../../ProtectedFaculty";
import LessonControlButtons from "../Modules/LessonControlButtons";
import DeleteModal from "./DeleteModal";

export default function Quizzes() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(quizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const deleteThisQuiz = async (quizId: string) => {
    await quizzesClient.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };

  const handleShow = (quizId: string) => {
    setSelectedQuizId(quizId);
  };

  const handleClose = () => {
    setSelectedQuizId(null);
  };

  return (
    <div>
      <ListGroup className="wd-quizzes rounded-0">
        {quizzes.map((quiz: any) => (
          <ListGroup.Item className="wd-quiz p-3 ps-1 d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <BsJournals className="me-3 fs-4 text-success" />
            <div className="flex-grow-1 me-3">
              <ProtectedFaculty studentAccess={<b>{quiz.title}</b>}>
                <a
                  href={`#/Kambaz/Courses/${cid}/quizzes/${quiz._id}`}
                  className="wd-quiz-link"
                >
                  {quiz.title}
                </a>
              </ProtectedFaculty>
              <br />
            </div>
            <ProtectedFaculty studentAccess={<></>}>
              <FaTrash
                className="text-danger me-2 mb-1"
                onClick={() => handleShow(quiz._id)}
              />
              <LessonControlButtons />
              <DeleteModal
                show={selectedQuizId === quiz._id}
                handleClose={handleClose}
                quizId={quiz._id}
                deleteThisQuiz={deleteThisQuiz}
                message="Are you sure you want to delete this quiz?"
              />
            </ProtectedFaculty>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
