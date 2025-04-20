import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function QuizDetailsEditor({
  quiz,
  onSave,
  onCancel,
  cid,
}: {
  quiz: any;
  onSave: (updatedQuiz: any) => void;
  onCancel: () => void;
  cid: string;
}) {
  const [editableQuiz, setEditableQuiz] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (quiz) {
      setEditableQuiz({ ...quiz });
    }
  }, [quiz]);

  const handleChange = (field: string, value: any) => {
    setEditableQuiz({ ...editableQuiz, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editableQuiz);
  };

  const handleSaveAndPublish = () => {
    const updatedQuiz = {
      ...editableQuiz,
      published: true,
    };
    onSave(updatedQuiz);
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  if (!quiz) return null;

  return (
    <Card style={{ minWidth: "600px" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="m-0">{quiz.title}</h3>
          <div>
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              className="me-2"
              onClick={handleSaveAndPublish}
            >
              Save and Publish
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Quiz Type</Form.Label>
            <Form.Select
              value={editableQuiz.quizType || ""}
              onChange={(e) => handleChange("quizType", e.target.value)}
            >
              <option value="graded">Graded Quiz</option>
              <option value="practice">Practice Quiz</option>
              <option value="survey">Survey</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Assignment Group</Form.Label>
            <Form.Select
              value={editableQuiz.assignmentGroup || ""}
              onChange={(e) => handleChange("assignmentGroup", e.target.value)}
            >
              <option value="Assignments">Assignments</option>
              <option value="Quizzes">Quizzes</option>
              <option value="Exams">Exams</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Shuffle Answers"
              checked={editableQuiz.shuffleAnswers || false}
              onChange={(e) => handleChange("shuffleAnswers", e.target.checked)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Time Limit (Minutes)</Form.Label>
            <Form.Control
              type="number"
              value={editableQuiz.timeLimit || 0}
              onChange={(e) =>
                handleChange("timeLimit", parseInt(e.target.value))
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Multiple Attempts"
              checked={editableQuiz.multipleAttempts || false}
              onChange={(e) =>
                handleChange("multipleAttempts", e.target.checked)
              }
            />
          </Form.Group>

          {editableQuiz.multipleAttempts && (
            <Form.Group className="mb-3">
              <Form.Label>How Many Attempts</Form.Label>
              <Form.Control
                type="number"
                value={editableQuiz.attemptsAllowed || 1}
                onChange={(e) =>
                  handleChange("attemptsAllowed", parseInt(e.target.value))
                }
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Show Correct Answers"
              checked={editableQuiz.showCorrectAnswers || false}
              onChange={(e) =>
                handleChange("showCorrectAnswers", e.target.checked)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Access Code</Form.Label>
            <Form.Control
              type="text"
              value={editableQuiz.accessCode || ""}
              onChange={(e) => handleChange("accessCode", e.target.value)}
              placeholder="(None)"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="One Question at a Time"
              checked={editableQuiz.oneQuestionAtATime || false}
              onChange={(e) =>
                handleChange("oneQuestionAtATime", e.target.checked)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Webcam Required"
              checked={editableQuiz.webcamRequired || false}
              onChange={(e) => handleChange("webcamRequired", e.target.checked)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Lock Questions After Answering"
              checked={editableQuiz.lockQuestionsAfterAnswering || false}
              onChange={(e) =>
                handleChange("lockQuestionsAfterAnswering", e.target.checked)
              }
            />
          </Form.Group>

          <h5 className="mt-4 mb-3">Dates</h5>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={
                    editableQuiz.dueDate
                      ? new Date(editableQuiz.dueDate)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    handleChange("dueDate", new Date(e.target.value).getTime())
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Available From</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={
                    editableQuiz.availableDate
                      ? new Date(editableQuiz.availableDate)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "availableDate",
                      new Date(e.target.value).getTime()
                    )
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Until</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={
                    editableQuiz.untilDate
                      ? new Date(editableQuiz.untilDate)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "untilDate",
                      new Date(e.target.value).getTime()
                    )
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}
