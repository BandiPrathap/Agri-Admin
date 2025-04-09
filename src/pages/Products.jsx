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
  const [filterVirus, setFilterVirus] = useState('');
  const [filteredViruses, setFilteredViruses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [stockInput, setStockInput] = useState(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
  
      const now = Date.now();
      const cacheTTL = 5 * 60 * 1000; // 5 minutes
  
      // Try to fetch from localStorage
      const cachedData = JSON.parse(localStorage.getItem("productDataCache")) || {};
      const isCacheValid = cachedData.timestamp && (now - cachedData.timestamp) < cacheTTL;
  
      let productsData, categoriesData, virusesData;
  
      if (isCacheValid) {
        productsData = cachedData.products;
        categoriesData = cachedData.categories;
        virusesData = cachedData.viruses;
      } else {
        const [productsRes, categoriesRes, virusesRes] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getViruses()
        ]);
  
        productsData = await Promise.all(
          productsRes.data.map(async (product) => {
            const [productVirusesRes, productCategoriesRes] = await Promise.all([
              api.getProductViruses(product.id),
              api.getProductCategories(product.id)
            ]);
            return {
              ...product,
              viruses: productVirusesRes.data,
              categories: productCategoriesRes.data
            };
          })
        );
  
        categoriesData = categoriesRes.data;
        virusesData = virusesRes.data;
  
        // Save to localStorage
        localStorage.setItem("productDataCache", JSON.stringify({
          products: productsData,
          categories: categoriesData,
          viruses: virusesData,
          timestamp: now
        }));
      }
  
      setProducts(productsData);
      setCategories(categoriesData);
      setViruses(virusesData);
  
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (filterCategory) {
      const filtered = viruses.filter(v => v.category_id === parseInt(filterCategory));
      setFilteredViruses(filtered);
    } else {
      setFilteredViruses(viruses);
    }
    setFilterVirus(''); // reset virus filter when category changes
  }, [filterCategory, viruses]);
 
  const getCategoryNames = (product) => {
    if (!product.categories || product.categories.length === 0) return 'Unknown';
    return product.categories.map(c => c.name_en).join(', ');
  };
  
  const getVirusNames = (product) => {
    if (!product.viruses || product.viruses.length === 0) return 'Unknown';
    return product.viruses.map(v => v.name_en).join(', ');
  };

  const handleAddProduct = async (product) => {
    try {
      await api.addProduct(product);
      localStorage.removeItem("productDataCache"); // Clear cache
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
      localStorage.removeItem("productDataCache"); 
      fetchData();
      setShowModal(false);
      setSelectedProduct(null);
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_te.includes(searchTerm);
  
    const matchesCategory = filterCategory
      ? product.categories.some(cat => cat.id === parseInt(filterCategory))
      : true;
  
    const matchesVirus = filterVirus
      ? product.viruses.some(virus => virus.id === parseInt(filterVirus))
      : true;
  
    const matchesType = filterType
      ? product.type.toLowerCase().trim() === filterType.toLowerCase().trim()
      : true;
  
    return matchesSearch && matchesCategory && matchesVirus && matchesType;
  });

  const onUpdatePrice = (product) => {
    setSelectedProduct(product);
    setPriceInput(product.price);
    setShowPriceModal(true);
  };
  
  const onUpdateStock = (product) => {
    setSelectedProduct(product);
    setStockInput(product.quantity);
    setShowStockModal(true);
  };
  
  const onDeleteConfirm = (product) => {
    setSelectedProduct(product);
    setDeleteConfirmation('');
    setShowDeleteModal(true);
  };
  
  const handleSavePrice = async () => {
    try {
      await api.updateProduct(selectedProduct.id, { ...selectedProduct, price: priceInput });
      localStorage.removeItem("productDataCache"); 
      fetchData();
      toast.success('Price updated successfully');
      setShowPriceModal(false);
    } catch {
      toast.error('Failed to update price');
    }
  };
  
  const handleSaveStock = async () => {
    try {
      await api.updateProduct(selectedProduct.id, { ...selectedProduct, quantity: stockInput });
      localStorage.removeItem("productDataCache"); 
      fetchData();
      toast.success('Stock updated successfully');
      setShowStockModal(false);
    } catch {
      toast.error('Failed to update stock');
    }
  };
  
  const handleConfirmedDelete = async () => {
    if (deleteConfirmation !== selectedProduct.name_en) {
      toast.error('Product name does not match');
      return;
    }
    try {
      await api.deleteProduct(selectedProduct.id);
      localStorage.removeItem("productDataCache"); 
      fetchData();
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
    } catch {
      toast.error('Failed to delete product');
    }
  };
  
  

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
                value={filterVirus}
                onChange={(e) => setFilterVirus(e.target.value)}
              >
                <option value="">🦠 All Viruses</option>
                {filteredViruses.map((virus) => (
                  <option key={virus.id} value={virus.id}>
                    {virus.name_en}
                  </option>
                ))}
              </Form.Select>
            </Col>
            {/* <Col md={3}>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value=""> All Types</option>
                <option value="Liquid">Liquid</option>
                <option value="Solid">Solid</option>
              </Form.Select>
            </Col> */}
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
                    <Badge bg="info">{getCategoryNames(product)}</Badge>
                  </td>
                  <td>{getVirusNames(product)}</td>
                  <td>
                    <Badge bg={product.type === 'liquid' ? 'primary' : 'secondary'}>
                      {product.type}
                    </Badge>
                  </td>
                  <td>
                     <div className='d-flex space-between align-items-center'>
                      ₹{product.price}{' '}
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => onUpdatePrice(product)}
                          style={{ border:"none"}}
                          aria-label="Update Price"
                        >
                          <i className="fas fa-pen"></i>
                        </Button>
                     </div>
                  </td>
                  <td>
                  <div className='d-flex space-between align-items-center'>
                    <Badge bg={product.quantity > 0 ? 'success' : 'danger'} className='h-100'>
                      {product.quantity} in stock
                    </Badge>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onUpdateStock(product)}
                      style={{ border:"none"}}
                      aria-label="Update Stock"
                    >
                      <i className="fas fa-pen"></i>
                    </Button>
                    </div>
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
                        onClick={() => onDeleteConfirm(product)}
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
      <Modal show={showPriceModal} onHide={() => setShowPriceModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="number"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPriceModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSavePrice}>Save</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showStockModal} onHide={() => setShowStockModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center gap-3">
            <Button variant="outline-secondary" onClick={() => setStockInput(prev => Math.max(0, prev - 1))}>-</Button>
            <Form.Control
              type="number"
              value={stockInput}
              onChange={(e) => setStockInput(parseInt(e.target.value))}
              className="w-50"
            />
            <Button variant="outline-secondary" onClick={() => setStockInput(prev => prev + 1)}>+</Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStockModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveStock}>Save</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please type <strong>{selectedProduct?.name_en}</strong> to confirm deletion:</p>
          <Form.Control
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmedDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;