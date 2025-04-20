import { Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";

export default function QuizDetailsView({
  quiz,
  totalPoints,
  onEdit,
}: {
  quiz: any;
  totalPoints: number;
  onEdit: () => void;
}) {
  if (!quiz) return null;
  const navigate = useNavigate();
  const { cid } = useParams();

  return (
    <Card style={{ minWidth: "600px" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="m-0">{quiz.title}</h3>
          <Button variant="outline-primary" onClick={onEdit}>
            Edit Details
          </Button>
        </div>

        <p>
          <strong>Quiz Type:</strong> {quiz.quizType}
        </p>
        <p>
          <strong>Points:</strong> {totalPoints}
        </p>
        <p>
          <strong>Assignment Group:</strong> {quiz.assignmentGroup}
        </p>
        <p>
          <strong>Shuffle Answers:</strong> {quiz.shuffleAnswers ? "Yes" : "No"}
        </p>
        <p>
          <strong>Time Limit:</strong> {quiz.timeLimit} Minutes
        </p>
        <p>
          <strong>Multiple Attempts:</strong>{" "}
          {quiz.multipleAttempts ? "Yes" : "No"}
        </p>
        {quiz.multipleAttempts && (
          <p>
            <strong>How Many Attempts:</strong> {quiz.attemptsAllowed}
          </p>
        )}
        <p>
          <strong>Show Correct Answers:</strong>{" "}
          {quiz.showCorrectAnswers ? "Yes" : "No"}
        </p>
        <p>
          <strong>Access Code:</strong> {quiz.accessCode || "(None)"}
        </p>
        <p>
          <strong>One Question at a Time:</strong>{" "}
          {quiz.oneQuestionAtATime ? "Yes" : "No"}
        </p>
        <p>
          <strong>Webcam Required:</strong> {quiz.webcamRequired ? "Yes" : "No"}
        </p>
        <p>
          <strong>Lock Questions After Answering:</strong>{" "}
          {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
        </p>

        <div style={{ display: "flex", fontWeight: 600, fontSize: "0.95rem" }}>
          <div style={{ flex: 1 }}>Due</div>
          <div style={{ flex: 1 }}>For</div>
          <div style={{ flex: 1 }}>Available from</div>
          <div style={{ flex: 1 }}>Until</div>
        </div>

        <hr style={{ marginTop: "0.2rem", marginBottom: "0.5rem" }} />

        <div style={{ display: "flex", fontSize: "0.95rem" }}>
          <div style={{ flex: 1 }}>
            {quiz.dueDate &&
              new Date(quiz.dueDate).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
          </div>
          <div style={{ flex: 1 }}>Everyone</div>
          <div style={{ flex: 1 }}>
            {quiz.availableDate &&
              new Date(quiz.availableDate).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
          </div>
          <div style={{ flex: 1 }}>
            {quiz.untilDate &&
              new Date(quiz.untilDate).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/Kambaz/Courses/${cid}/quizzes/${quiz._id}/preview`)
            }
          >
            Preview Quiz
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
