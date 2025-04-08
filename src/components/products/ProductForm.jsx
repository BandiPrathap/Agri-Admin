import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const ProductForm = ({ categories = [], viruses = [], onSubmit, initialData }) => {
  const [product, setProduct] = useState({
    name_en: '',
    name_te: '',
    company: '',
    category_id: [],
    virus_id: [],
    imageUrl: null,
    price: '',
    quantity: '',
    description: '',
    type: 'Liquid',
  });

  const [categoryViruses, setCategoryViruses] = useState([]);

  useEffect(() => {
    if (initialData) {
      // Safely handle category_id
      const initialCategories = initialData.category_id || [];
      const selectedCategoryIds = Array.isArray(initialCategories)
        ? initialCategories
        : [initialCategories];
  
      // Safely handle virus_id
      const initialViruses = initialData.virus_id || [];
      const selectedVirusIds = Array.isArray(initialViruses)
        ? initialViruses
        : [initialViruses];
  
      setProduct({
        ...initialData,
        category_id: selectedCategoryIds.filter(Boolean).map(String),
        virus_id: selectedVirusIds.filter(Boolean).map(String),
        imageUrl: null,
        type: initialData.type || 'Liquid',
      });
      
      filterVirusesByCategory(selectedCategoryIds.filter(Boolean).map(String));
    }
  }, [initialData]);
  
  useEffect(() => {
    if (product.category_id.length > 0) {
      filterVirusesByCategory(product.category_id);
    } else {
      setCategoryViruses([]);
    }
  }, [product.category_id, viruses]);

  const filterVirusesByCategory = (categoryIds) => {
    const filtered = viruses.filter(v => categoryIds.includes(String(v.category_id)));
    setCategoryViruses(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProduct(prev => ({ ...prev, imageUrl: e.target.files[0] }));
  };

  const handleCategoryCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setProduct(prev => {
      const updatedCategories = checked
        ? [...prev.category_id, value]
        : prev.category_id.filter(id => id !== value);
      return {
        ...prev,
        category_id: updatedCategories,
        virus_id: prev.virus_id.filter(vid => {
          const virus = viruses.find(v => v.id.toString() === vid);
          return virus && updatedCategories.includes(String(virus.category_id));
        })
      };
    });
  };

  const handleVirusCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setProduct(prev => {
      const updatedViruses = checked
        ? [...prev.virus_id, value]
        : prev.virus_id.filter(id => id !== value);
      return { ...prev, virus_id: updatedViruses };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
  
      formData.append("name_en", product.name_en);
      formData.append("name_te", product.name_te);
      formData.append("company", product.company);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      formData.append("description", product.description);
  
      // Append multi-select fields
      product.category_id.forEach((catId) => formData.append("category_id", catId));
      product.virus_id.forEach((virusId) => formData.append("virus_id", virusId));
  
      // Append image for creation only
      if (!initialData && product.imageUrl) {
        formData.append("image", product.imageUrl);
      }
  
      if (initialData) {
        // For update — send JSON (no image handling)
        const updatePayload = {
          ...product,
          imageUrl: undefined, // Just in case
        };
        await axios.put(`https://raythu-admin.vercel.app/product/${initialData.id}`, updatePayload);
        alert("Product updated successfully!");
      } else {
        // For add — use multipart/form-data
        await axios.post("https://raythu-admin.vercel.app/product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product added successfully!");
      }
  
      if (onSubmit) onSubmit();
    } catch (err) {
      console.error("Form submission error:", err);
      alert("Something went wrong.");
    }
  };
  
  

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Name (English)</Form.Label>
            <Form.Control type="text" name="name_en" value={product.name_en} onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Name (Telugu)</Form.Label>
            <Form.Control type="text" name="name_te" value={product.name_te} onChange={handleChange} required />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control type="text" name="company" value={product.company} onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" name="imageUrl" onChange={handleFileChange} accept="image/*" />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Categories</Form.Label>
        <div className='d-flex space-between'>
          {categories.map(category => (
            <Form.Check
              key={category.id}
              type="checkbox"
              label={category.name_en}
              value={category.id}
              checked={product.category_id.includes(category.id.toString())}
              onChange={handleCategoryCheckboxChange}
              className='m-2'
            />
          ))}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Target Viruses</Form.Label>
        <div>
          {categoryViruses.map(virus => (
            <Form.Check
              key={virus.id}
              type="checkbox"
              label={virus.name_en}
              value={virus.id}
              checked={product.virus_id.includes(virus.id.toString())}
              onChange={handleVirusCheckboxChange}
            />
          ))}
          {categoryViruses.length === 0 && <div className="text-muted">No viruses for selected category</div>}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <div>
          <Form.Check inline type="radio" label="Liquid" name="type" value="Liquid" checked={product.type === 'Liquid'} onChange={handleChange} />
          <Form.Check inline type="radio" label="Solid" name="type" value="Solid" checked={product.type === 'Solid'} onChange={handleChange} />
        </div>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Price (₹)</Form.Label>
            <Form.Control type="number" name="price" value={product.price} onChange={handleChange} min="0" step="0.01" required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" name="quantity" value={product.quantity} onChange={handleChange} min="0" required />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={3} name="description" value={product.description} onChange={handleChange} />
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
