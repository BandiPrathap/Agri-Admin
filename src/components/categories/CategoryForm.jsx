import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const CategoryForm = ({ onSubmit }) => {
  const [category, setCategory] = useState({
    name_en: '',
    name_te: ''
  });

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(category);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name (English)</Form.Label>
        <Form.Control
          type="text"
          name="name_en"
          value={category.name_en}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Name (Telugu)</Form.Label>
        <Form.Control
          type="text"
          name="name_te"
          value={category.name_te}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="primary" type="submit">
          Save Category
        </Button>
      </div>
    </Form>
  );
};

export default CategoryForm;