import { Modal, Button } from "react-bootstrap";
export default function DeleteModal({
  show,
  handleClose,
  quizId,
  deleteThisQuiz,
  message,
}: {
  show: boolean;
  handleClose: () => void;
  quizId: string;
  deleteThisQuiz: (quizId: string) => void;
  message: string;
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{message}</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            deleteThisQuiz(quizId);
            handleClose();
          }}
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
