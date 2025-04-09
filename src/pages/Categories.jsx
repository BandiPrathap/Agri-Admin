import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import CategoryForm from '../components/categories/CategoryForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [confirmName, setConfirmName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const now = Date.now();
      const cacheTTL = 5 * 60 * 1000; // 5 minutes
  
      const cached = JSON.parse(localStorage.getItem("categoryDataCache")) || {};
      const isCacheValid = cached.timestamp && (now - cached.timestamp < cacheTTL);
  
      if (isCacheValid) {
        setCategories(cached.categories);
      } else {
        const response = await api.getCategories();
        const freshCategories = response.data;
        setCategories(freshCategories);
  
        localStorage.setItem("categoryDataCache", JSON.stringify({
          categories: freshCategories,
          timestamp: now
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddOrUpdateCategory = async (category) => {
    try {
      if (editCategory) {
        await api.updateCategory(editCategory.id, category);
        toast.success('Category updated successfully');
      } else {
        await api.addCategory(category);
        toast.success('Category added successfully');
      }
      localStorage.removeItem("categoryDataCache");
      fetchCategories();
      setShowModal(false);
      setEditCategory(null);
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async () => {
    if (confirmName !== categoryToDelete.name_en) {
      toast.error("Category name doesn't match!");
      return;
    }

    try {
      await api.deleteCategory(categoryToDelete.id);
      toast.success('Category deleted successfully');
      localStorage.removeItem("categoryDataCache");
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    } finally {
      setDeleteModal(false);
      setConfirmName('');
      setCategoryToDelete(null);
    }
  };

  const openEditModal = (category) => {
    setEditCategory(category);
    setShowModal(true);
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModal(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="d-flex justify-content-between mb-4 mt-5">
        <h3>
          <i className="fas fa-list me-2"></i>
          Categories Management
        </h3>
        <Button onClick={() => setShowModal(true)} variant="primary">
          <i className="fas fa-plus me-2"></i>Add Category
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name (English)</th>
            <th>Name (Telugu)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name_en}</td>
              <td>{category.name_te}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => openEditModal(category)}
                  className="me-2"
                >
                  <i className="fas fa-edit"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => openDeleteModal(category)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditCategory(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editCategory ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CategoryForm
            onSubmit={handleAddOrUpdateCategory}
            initialData={editCategory}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            To delete <strong>{categoryToDelete?.name_en}</strong>, please type the name to confirm.
          </p>
          <Form.Control
            type="text"
            placeholder="Type category name"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCategory}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categories;
