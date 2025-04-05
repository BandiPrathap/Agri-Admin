import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const ProductForm = ({ categories = [], viruses = [], onSubmit, initialData }) => {
  const [product, setProduct] = useState({
    name_en: '',
    name_te: '',
    company: '',
    category_id: '',
    virus_id: '',
    imageUrl: null, // holds the File object
    price: '',
    quantity: '',
    description: '',
    type: 'Liquid' // default to 'Liquid'
  });

  const [categoryViruses, setCategoryViruses] = useState([]);

  useEffect(() => {
    if (initialData) {
      setProduct({
        ...initialData,
        imageUrl: null,
        type: initialData.type || 'Liquid' 
      });
      filterVirusesByCategory(initialData.category_id, initialData.virus_id);
    }
  }, [initialData]);

  useEffect(() => {
    if (categories.length > 0 && !initialData) {
      const defaultCategoryId = categories[0].id.toString();
      setProduct(prev => ({
        ...prev,
        category_id: defaultCategoryId
      }));
      filterVirusesByCategory(defaultCategoryId);
    }
  }, [categories, initialData]);

  useEffect(() => {
    if (product.category_id) {
      filterVirusesByCategory(product.category_id);
    }
  }, [viruses]);

  const filterVirusesByCategory = (categoryId, existingVirusId = '') => {
    const filtered = viruses.filter(v => String(v.category_id) === String(categoryId));
    setCategoryViruses(filtered);

    setProduct(prev => ({
      ...prev,
      virus_id: existingVirusId || (filtered.length > 0 ? filtered[0].id.toString() : '')
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProduct(prev => ({ ...prev, imageUrl: e.target.files[0] }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setProduct(prev => ({
      ...prev,
      category_id: categoryId,
      virus_id: ''
    }));
    filterVirusesByCategory(categoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    try {
      let imageUrl = initialData?.image_url || '';

      // If new image file selected, upload to image server
      // Append all product fields including imageUrl
const formData = new FormData();
Object.entries(product).forEach(([key, value]) => {
  if (key === 'imageUrl' && value) {
    formData.append('image', value); // must match `upload.single('image')` on server
  } else {
    formData.append(key, value);
  }
});

try {
  const res = await axios.post('https://raythu-admin.vercel.app/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  alert('Product created successfully!');
} catch (error) {
  console.error('Error during form submission:', error);
  alert('Submission failed.');
}


      // Append all product fields to formData
      Object.entries(product).forEach(([key, value]) => {
        if (key !== 'imageUrl') {
          formData.append(key, value);
        }
      });

      // Add image_url from upload or existing
      formData.append('image_url', imageUrl);

      onSubmit(formData);
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('Image upload or form submission failed.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Name (English)</Form.Label>
            <Form.Control
              type="text"
              name="name_en"
              value={product.name_en}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Name (Telugu)</Form.Label>
            <Form.Control
              type="text"
              name="name_te"
              value={product.name_te}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              name="company"
              value={product.company}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="imageUrl"
              onChange={handleFileChange}
              accept="image/*"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category_id"
              value={product.category_id}
              onChange={handleCategoryChange}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name_en}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Target Virus</Form.Label>
            <Form.Select
              name="virus_id"
              value={product.virus_id}
              onChange={handleChange}
              required
              disabled={categoryViruses.length === 0}
            >
              <option value="">Select Virus</option>
              {categoryViruses.map((virus) => (
                <option key={virus.id} value={virus.id}>
                  {virus.name_en}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
  <Form.Label>Type</Form.Label>
  <div>
    <Form.Check
      inline
      type="radio"
      label="Liquid"
      name="type"
      value="Liquid"
      checked={product.type === 'Liquid'}
      onChange={handleChange}
    />
    <Form.Check
      inline
      type="radio"
      label="Solid"
      name="type"
      value="Solid"
      checked={product.type === 'Solid'}
      onChange={handleChange}
    />
  </div>
</Form.Group>


      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Price (₹)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={product.description}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="primary" type="submit">
          {initialData ? 'Update Product' : 'Save Product'}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;
