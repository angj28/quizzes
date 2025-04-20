import React from "react";
import { Button, Form } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa";

export default function QuizTitleEditor({
  title,
  isEditing,
  onStartEditing,
  onSave,
  onCancel,
}: {
  title: string;
  isEditing: boolean;
  onStartEditing: () => void;
  onSave: (newTitle: string) => void;
  onCancel: () => void;
}) {
  const [editableTitle, setEditableTitle] = React.useState(title);

  React.useEffect(() => {
    setEditableTitle(title);
  }, [title]);

  const handleSave = () => {
    onSave(editableTitle);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="d-flex align-items-center mb-3">
      {isEditing ? (
        <div className="d-flex w-100">
          <Form.Control
            type="text"
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            autoFocus
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
          />
          <Button variant="primary" className="ms-2" onClick={handleSave}>
            Save
          </Button>
        </div>
      ) : (
        <>
          <h3 className="m-0 me-2">{title}</h3>
          <Button
            variant="link"
            className="p-0 text-decoration-none"
            onClick={onStartEditing}
          >
            <FaPencilAlt className="text-primary" />
          </Button>
        </>
      )}
    </div>
  );
}
