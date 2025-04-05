import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Badge, Container, Card } from 'react-bootstrap';
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [virusesRes, categoriesRes] = await Promise.all([
        api.getViruses(),
        api.getCategories()
      ]);
      setViruses(virusesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVirus = async (virus) => {
    try {
      await api.addVirus(virus);
      fetchData();
      setShowModal(false);
      toast.success('Virus added successfully');
    } catch (error) {
      toast.error('Failed to add virus');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name_en : 'Unknown';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="mt-5">
      <Card className="shadow-sm border-0">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="fas fa-biohazard me-2"></i> Viruses Management
          </h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus me-1"></i> Add Virus
          </Button>
        </Card.Header>

        <Card.Body>
          {viruses.length === 0 ? (
            <p className="text-center text-muted">No viruses found.</p>
          ) : (
            <div className="table-responsive">
              <Table hover bordered className="align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name (English)</th>
                    <th>Name (Telugu)</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {viruses.map((virus) => (
                    <tr key={virus.id}>
                      <td>{virus.id}</td>
                      <td>{virus.name_en}</td>
                      <td>{virus.name_te}</td>
                      <td>
                        <Badge bg="info">{getCategoryName(virus.category_id)}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Add New Virus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VirusForm categories={categories} onSubmit={handleAddVirus} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Viruses;
