import { Modal, Button } from "react-bootstrap";
export default function DeleteQuestionModal({
  show,
  handleClose,
  questionId,
  deleteQuestion,
}: {
  show: boolean;
  handleClose: () => void;
  questionId: string;
  deleteQuestion: (quizId: string) => void;
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Are you sure you want to delete this question?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            deleteQuestion(questionId);
            handleClose();
          }}
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
