import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const VirusForm = ({ categories, onSubmit }) => {
  const [virus, setVirus] = useState({
    name_en: '',
    name_te: '',
    category_id: categories.length > 0 ? categories[0].id : ''
  });

  const handleChange = (e) => {
    setVirus({ ...virus, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(virus);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name (English)</Form.Label>
        <Form.Control
          type="text"
          name="name_en"
          value={virus.name_en}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Name (Telugu)</Form.Label>
        <Form.Control
          type="text"
          name="name_te"
          value={virus.name_te}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select
          name="category_id"
          value={virus.category_id}
          onChange={handleChange}
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name_en}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="primary" type="submit">
          Save Virus
        </Button>
      </div>
    </Form>
  );
};

export default VirusForm;