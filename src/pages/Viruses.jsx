import React, { useState, useEffect } from 'react';
import {
  Button, Modal, Table, Badge, Container, Card, Form, InputGroup, Dropdown
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import VirusForm from '../components/viruses/VirusForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const Viruses = () => {
  const [viruses, setViruses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedVirus, setSelectedVirus] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
  
      // Check cache
      const cachedViruses = localStorage.getItem('viruses');
      const cachedCategories = localStorage.getItem('categories');
      const cacheTime = localStorage.getItem('cacheTime');
  
      const isCacheValid = cacheTime && (Date.now() - parseInt(cacheTime)) < 5 * 60 * 1000; // 5 min
  
      if (cachedViruses && cachedCategories && isCacheValid) {
        setViruses(JSON.parse(cachedViruses));
        setCategories(JSON.parse(cachedCategories));
        setLoading(false);
        return;
      }
  
      // Fetch fresh data
      const [virusesRes, categoriesRes] = await Promise.all([
        api.getViruses(),
        api.getCategories()
      ]);
  
      setViruses(virusesRes.data);
      setCategories(categoriesRes.data);
  
      // Store in cache
      localStorage.setItem('viruses', JSON.stringify(virusesRes.data));
      localStorage.setItem('categories', JSON.stringify(categoriesRes.data));
      localStorage.setItem('cacheTime', Date.now().toString());
  
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddOrUpdateVirus = async (virus) => {
    try {
      if (selectedVirus) {
        await api.updateVirus(selectedVirus.id, virus);
        toast.success('Virus updated successfully');
      } else {
        await api.addVirus(virus);
        toast.success('Virus added successfully');
      }
      localStorage.removeItem('viruses');
      localStorage.removeItem('categories');
      localStorage.removeItem('cacheTime');

      setShowModal(false);
      setSelectedVirus(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save virus');
    }
  };

  const handleDeleteVirus = async () => {
    try {
      await api.deleteVirus(selectedVirus.id);
      toast.success('Virus deleted successfully');
          // Clear cache
      localStorage.removeItem('viruses');
      localStorage.removeItem('categories');
      localStorage.removeItem('cacheTime');
      setShowConfirm(false);
      setSelectedVirus(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete virus');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name_en : 'Unknown';
  };

  const filteredViruses = viruses.filter((virus) => {
    const matchesName = virus.name_en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? virus.category_id === parseInt(filterCategory) : true;
    return matchesName && matchesCategory;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="mt-5">
      <Card className="shadow-sm border-0">
        <Card.Header className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h4 className="mb-0"><i className="fas fa-biohazard me-2"></i>Viruses Management</h4>
          <div className="d-flex flex-wrap gap-2">
            <InputGroup>
              <Form.Control
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Form.Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name_en}</option>
              ))}
            </Form.Select>
            <Button variant="primary" onClick={() => { setSelectedVirus(null); setShowModal(true); }}>
              <i className="fas fa-plus me-1"></i> Add Virus
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {filteredViruses.length === 0 ? (
            <p className="text-center text-muted">No viruses found.</p>
          ) : (
            <div className="table-responsive">
              <Table hover bordered className="align-middle text-center">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name (English)</th>
                    <th>Name (Telugu)</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredViruses.map((virus) => (
                    <tr key={virus.id}>
                      <td>{virus.id}</td>
                      <td>{virus.name_en}</td>
                      <td>{virus.name_te}</td>
                      <td>
                        <Badge bg="info">{getCategoryName(virus.category_id)}</Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => { setSelectedVirus(virus); setShowModal(true); }}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => { setSelectedVirus(virus); setShowConfirm(true); }}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="text-dark">
          <Modal.Title>{selectedVirus ? 'Edit Virus' : 'Add New Virus'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VirusForm
            categories={categories}
            onSubmit={handleAddOrUpdateVirus}
            initialData={selectedVirus}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedVirus?.name_en}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteVirus}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Viruses;
