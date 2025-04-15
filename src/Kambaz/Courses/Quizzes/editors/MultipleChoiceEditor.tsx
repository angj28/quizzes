import { Form, Button, InputGroup } from "react-bootstrap";

export default function MultipleChoiceEditor({
  choices,
  onChange,
}: {
  choices: any[];
  onChange: (choices: any[]) => void;
}) {
  const handleChoiceTextChange = (index: number, text: string) => {
    const updatedChoices = [...choices];
    updatedChoices[index].text = text;
    onChange(updatedChoices);
  };

  const handleCorrectChoiceChange = (index: number) => {
    const updatedChoices = choices.map((choice, idx) => ({
      ...choice,
      isCorrect: idx === index,
    }));
    onChange(updatedChoices);
  };

  const handleAddChoice = () => {
    const lastId = choices[choices.length - 1].id;
    const nextId = String.fromCharCode(lastId.charCodeAt(0) + 1);

    const newChoice = {
      id: nextId,
      text: "",
      isCorrect: false,
    };

    onChange([...choices, newChoice]);
  };

  const handleRemoveChoice = (index: number) => {
    if (choices.length <= 2) return;

    const updatedChoices = choices.filter((_, idx) => idx !== index);

    if (choices[index].isCorrect && updatedChoices.every((c) => !c.isCorrect)) {
      updatedChoices[0].isCorrect = true;
    }

    onChange(updatedChoices);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Answers:</Form.Label>

      {choices.map((choice, index) => (
        <InputGroup key={choice.id} className="mb-2">
          <InputGroup.Text>
            <Form.Check
              type="radio"
              checked={choice.isCorrect}
              onChange={() => handleCorrectChoiceChange(index)}
              aria-label={`Option ${choice.id} is correct`}
            />
          </InputGroup.Text>
          <InputGroup.Text>{choice.id}</InputGroup.Text>
          <Form.Control
            type="text"
            value={choice.text}
            onChange={(e) => handleChoiceTextChange(index, e.target.value)}
            placeholder={`Option ${choice.id}`}
          />
          <Button
            variant="outline-danger"
            onClick={() => handleRemoveChoice(index)}
            disabled={choices.length <= 2}
          >
            &times;
          </Button>
        </InputGroup>
      ))}

      <Button
        variant="outline-secondary"
        size="sm"
        className="mt-2"
        onClick={handleAddChoice}
      >
        + Add Another Answer
      </Button>
    </Form.Group>
  );
}
