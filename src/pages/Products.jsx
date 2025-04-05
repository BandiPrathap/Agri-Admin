import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Card, Badge, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import ProductForm from '../components/products/ProductForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viruses, setViruses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, virusesRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getViruses()
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setViruses(virusesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (product) => {
    try {
      await api.addProduct(product);
      fetchData();
      setShowModal(false);
      toast.success('Product added successfully');
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async (product) => {
    try {
      await api.updateProduct(selectedProduct.id, product);
      fetchData();
      setShowModal(false);
      setSelectedProduct(null);
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        fetchData();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name_en : 'Unknown';
  };

  const getVirusName = (virusId) => {
    const virus = viruses.find(v => v.id === virusId);
    return virus ? virus.name_en : 'Unknown';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_te.includes(searchTerm);

    const matchesCategory = filterCategory
      ? product.category_id === parseInt(filterCategory)
      : true;
      
      const matchesType = filterType
      ? product.type.toLowerCase().trim() === filterType.toLowerCase().trim()
      : true;

    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h3 className="mb-0">
          <i className="fas fa-spray-can me-2 text-primary"></i>
          <span className="fw-bold">Products Management</span>
        </h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus me-2"></i>Add Product
        </Button>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="gy-2">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="🔍 Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">📁 All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_en}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value=""> All Types</option>
                <option value="Liquid">Liquid</option>
                <option value="Solid">Solid</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filteredProducts.length > 0 ? (
        <div className="table-responsive">
          <Table striped bordered hover className="align-middle shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Company</th>
                <th>Category</th>
                <th>Target Virus</th>
                <th>Type</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/50'}
                      alt={product.name_en}
                      className="rounded"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>
                    <div className="fw-semibold">{product.name_en}</div>
                    <div className="text-muted small">{product.name_te}</div>
                  </td>
                  <td>{product.company}</td>
                  <td>
                    <Badge bg="info">{getCategoryName(product.category_id)}</Badge>
                  </td>
                  <td>{getVirusName(product.virus_id)}</td>
                  <td>
                    <Badge bg={product.type === 'liquid' ? 'primary' : 'secondary'}>
                      {product.type}
                    </Badge>
                  </td>
                  <td>₹{product.price}</td>
                  <td>
                    <Badge bg={product.quantity > 0 ? 'success' : 'danger'}>
                      {product.quantity} in stock
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowModal(true);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-muted py-4">
          <i className="fas fa-box-open fa-2x mb-2"></i>
          <p>No products found.</p>
        </div>
      )}

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm
            categories={categories}
            viruses={viruses}
            onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}
            initialData={selectedProduct}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Products;
