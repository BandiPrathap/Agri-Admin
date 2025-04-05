import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import CategoryForm from '../components/categories/CategoryForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (category) => {
    try {
      await api.addCategory(category);
      fetchCategories();
      setShowModal(false);
      toast.success('Category added successfully');
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-4 mt-5">
        <h3>
          <i className="fas fa-list me-2"></i>
          Categories Management
        </h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus me-2"></i>Add Category
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name (English)</th>
            <th>Name (Telugu)</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name_en}</td>
              <td>{category.name_te}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CategoryForm onSubmit={handleAddCategory} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Categories;