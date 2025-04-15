import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import HtmlEditor from "react-simple-wysiwyg";
import MultipleChoiceEditor from "./editors/MultipleChoiceEditor";
import TrueFalseEditor from "./editors/TrueFalseEditor";
import FillInBlankEditor from "./editors/FillInBlankEditor";

export default function QuestionEditor({
  question,
  onSave,
  onCancel,
}: {
  question: any;
  onSave: (question: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<any>(question);

  useEffect(() => {
    setFormData(question);
  }, [question]);

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "points" ? parseInt(value, 10) : value,
    });
  };

  const handleQuestionTextChange = (html: string) => {
    setFormData({
      ...formData,
      questionText: html,
    });
  };

  const handleTypeChange = (e: any) => {
    const newType = e.target.value as any;

    let updatedFormData = {
      ...formData,
      questionType: newType,
    };

    if (newType === "multiple-choice") {
      updatedFormData.choices = [
        { id: "A", text: "", isCorrect: true },
        { id: "B", text: "", isCorrect: false },
        { id: "C", text: "", isCorrect: false },
        { id: "D", text: "", isCorrect: false },
      ];
      delete updatedFormData.isTrue;
      delete updatedFormData.correctAnswers;
      delete updatedFormData.caseSensitive;
    } else if (newType === "true-false") {
      updatedFormData.isTrue = true;
      delete updatedFormData.choices;
      delete updatedFormData.correctAnswers;
      delete updatedFormData.caseSensitive;
    } else if (newType === "fill-in-blank") {
      updatedFormData.correctAnswers = [""];
      updatedFormData.caseSensitive = false;
      delete updatedFormData.choices;
      delete updatedFormData.isTrue;
    }

    setFormData(updatedFormData);
  };

  const handleSaveQuestion = () => {
    onSave(formData);
  };

  const handleChoicesChange = (choices: any[]) => {
    setFormData({
      ...formData,
      choices,
    });
  };

  const handleIsTrueChange = (isTrue: boolean) => {
    setFormData({
      ...formData,
      isTrue,
    });
  };

  const handleCorrectAnswersChange = (correctAnswers: string[]) => {
    setFormData({
      ...formData,
      correctAnswers,
    });
  };

  const handleCaseSensitiveChange = (caseSensitive: boolean) => {
    setFormData({
      ...formData,
      caseSensitive,
    });
  };

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Question Title"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Select
              name="questionType"
              value={formData.questionType}
              onChange={handleTypeChange}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="fill-in-blank">Fill in the Blank</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>pts:</InputGroup.Text>
              <Form.Control
                type="number"
                name="points"
                className="mr-2"
                value={formData.points}
                onChange={handleInputChange}
                min={0}
              />
            </InputGroup>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Question:</Form.Label>
          <HtmlEditor
            value={formData.questionText}
            onChange={(e) => handleQuestionTextChange(e.target.value)}
          />
        </Form.Group>

        {/* Question type specific editors */}
        {formData.questionType === "multiple-choice" && formData.choices && (
          <MultipleChoiceEditor
            choices={formData.choices}
            onChange={handleChoicesChange}
          />
        )}

        {formData.questionType === "true-false" && (
          <TrueFalseEditor
            isTrue={formData.isTrue ?? false}
            onChange={handleIsTrueChange}
          />
        )}

        {formData.questionType === "fill-in-blank" &&
          formData.correctAnswers && (
            <FillInBlankEditor
              correctAnswers={formData.correctAnswers}
              caseSensitive={formData.caseSensitive ?? false}
              onAnswersChange={handleCorrectAnswersChange}
              onCaseSensitiveChange={handleCaseSensitiveChange}
            />
          )}

        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveQuestion}>
            {formData._id ? "Update Question" : "Add Question"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
