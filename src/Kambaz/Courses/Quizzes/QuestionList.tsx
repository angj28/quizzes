import { Card, Button, Badge } from "react-bootstrap";

export default function QuestionList({
  questions,
  onEdit,
  onDelete,
}: {
  questions: {
    _id: string;
    title: string;
    questionText: string;
    questionType: "multiple-choice" | "true-false" | "fill-in-blank";
    points: number;
    choices?: { id: string; text: string; isCorrect: boolean }[];
    isTrue?: boolean;
    correctAnswers?: string[];
  }[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (questions.length === 0) {
    return (
      <div className="alert alert-info">
        No questions yet. Click "New Question" to add one.
      </div>
    );
  }

  return (
    <div>
      {questions.map((question) => (
        <Card key={question._id} className="mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div className="me-4">
              {question.title} ({question.questionType})
            </div>
            <div>
              <Badge bg="primary" className="me-2">
                {question.points} pts
              </Badge>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(question._id)}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(question._id)}
              >
                Delete
              </Button>
            </div>
          </Card.Header>

          <Card.Body>
            <p
              className="mb-1"
              dangerouslySetInnerHTML={{ __html: question.questionText }}
            />

            {question.questionType === "multiple-choice" &&
              question.choices && (
                <div className="ms-3 mt-2">
                  {question.choices.map((choice) => (
                    <div
                      key={choice.id}
                      className={choice.isCorrect ? "text-success" : ""}
                    >
                      {choice.id}. {choice.text} {choice.isCorrect && "✓"}
                    </div>
                  ))}
                </div>
              )}

            {question.questionType === "true-false" && (
              <div className="ms-3 mt-2">
                Correct answer: {question.isTrue ? "True" : "False"}
              </div>
            )}

            {question.questionType === "fill-in-blank" &&
              question.correctAnswers && (
                <div className="ms-3 mt-2">
                  Correct answers: {question.correctAnswers.join(", ")}
                </div>
              )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
