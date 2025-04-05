import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56',
        '#4BC0C0', '#9966FF', '#FF9F40',
        '#C9CBCF', '#8ED1FC', '#FF8A65',
        '#9575CD'
      ],
      borderWidth: 1,
    }]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        api.getCategories(),
        api.getProducts()
      ]);

      const categoryCounts = categoriesRes.data.map(category => {
        return productsRes.data.filter(product => product.category_id === category.id).length;
      });

      setChartData(prev => ({
        ...prev,
        labels: categoriesRes.data.map(c => c.name_en),
        datasets: [{
          ...prev.datasets[0],
          data: categoryCounts
        }]
      }));
    } catch (error) {
      toast.error('Failed to load category data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="my-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-center mb-4" style={{ fontWeight: 600 }}>
                Products by Category
              </Card.Title>

              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="chart-container" style={{ position: 'relative', width: '100%', height: '300px' }}>
                  <Doughnut data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 15
                        }
                      }
                    }
                  }} />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryChart;
