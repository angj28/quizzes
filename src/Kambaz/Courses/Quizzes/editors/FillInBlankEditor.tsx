import { Form, Button, InputGroup } from "react-bootstrap";

export default function FillInBlankEditor({
  correctAnswers,
  caseSensitive,
  onAnswersChange,
  onCaseSensitiveChange,
}: {
  correctAnswers: string[];
  caseSensitive: boolean;
  onAnswersChange: (answers: string[]) => void;
  onCaseSensitiveChange: (caseSensitive: boolean) => void;
}) {
  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...correctAnswers];
    updatedAnswers[index] = value;
    onAnswersChange(updatedAnswers);
  };

  const handleAddAnswer = () => {
    onAnswersChange([...correctAnswers, ""]);
  };

  const handleRemoveAnswer = (index: number) => {
    if (correctAnswers.length <= 1) return;

    const updatedAnswers = correctAnswers.filter((_, idx) => idx !== index);
    onAnswersChange(updatedAnswers);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Answers:</Form.Label>

      {correctAnswers.map((answer, index) => (
        <InputGroup key={index} className="mb-2">
          <InputGroup.Text>Possible Answer:</InputGroup.Text>
          <Form.Control
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder="Enter an acceptable answer"
          />
          <Button
            variant="outline-danger"
            onClick={() => handleRemoveAnswer(index)}
            disabled={correctAnswers.length <= 1}
          >
            &times;
          </Button>
        </InputGroup>
      ))}

      <div className="mt-3">
        <Form.Check
          type="checkbox"
          id="case-sensitive"
          label="Case sensitive"
          checked={caseSensitive}
          onChange={(e) => onCaseSensitiveChange(e.target.checked)}
          className="mb-3"
        />
      </div>

      <Button variant="outline-secondary" size="sm" onClick={handleAddAnswer}>
        + Add Another Answer
      </Button>
    </Form.Group>
  );
}
