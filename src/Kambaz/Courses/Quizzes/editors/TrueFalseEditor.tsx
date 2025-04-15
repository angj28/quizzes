import { Form } from "react-bootstrap";

export default function TrueFalseEditor({
  isTrue,
  onChange,
}: {
  isTrue: boolean;
  onChange: (isTrue: boolean) => void;
}) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Answers:</Form.Label>

      <div>
        <Form.Check
          type="radio"
          id="true-option"
          label="True"
          checked={isTrue}
          onChange={() => onChange(true)}
          className="mb-2"
        />

        <Form.Check
          type="radio"
          id="false-option"
          label="False"
          checked={!isTrue}
          onChange={() => onChange(false)}
        />
      </div>
    </Form.Group>
  );
}
