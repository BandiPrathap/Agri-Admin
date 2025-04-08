import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import StatsCard from '../components/Dashboard/StatsCard';
import CategoryChart from '../components/Dashboard/CategoryChart';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    categories: 0,
    pendingOrders: 0
  });
  // const [products, setProducts] = useState([]);
  // const [categories, setCategories] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);
  
  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true);
  //     const [productsRes, categoriesRes, ordersRes] = await Promise.all([
  //       api.getProducts(),
  //       api.getCategories(),
  //       api.getOrders()
  //     ]);
  
  //     const pendingOrders = ordersRes.data.filter(order => order.status === 'pending').length;
  
  //     setProducts(productsRes.data);
  //     setCategories(categoriesRes.data);
  
  //     const updatedStats = {
  //       products: productsRes.data.length,
  //       orders: ordersRes.data.length,
  //       categories: categoriesRes.data.length,
  //       pendingOrders
  //     };
  
  //     console.log('📊 Dashboard stats:', updatedStats);
  
  //     setStats(updatedStats);
  //   } catch (error) {
  //     toast.error('Failed to load dashboard data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  // if (loading) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
  //       <div className="spinner-border text-primary" role="status">
  //         <span className="visually-hidden">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <h3 className="mb-4 mt-5">
        <i className="fas fa-tachometer-alt me-2"></i>
        Dashboard Overview
      </h3>

      <Row className="mb-4">
        <Col md={3}>
          <StatsCard
            title="Total Products"
            value={stats.products}
            icon="fas fa-spray-can"
            color="primary"
          />
        </Col>
        <Col md={3}>
          <StatsCard
            title="Total Orders"
            value={stats.orders}
            icon="fas fa-shopping-cart"
            color="success"
          />
        </Col>
        <Col md={3}>
          <StatsCard
            title="Categories"
            value={stats.categories}
            icon="fas fa-list"
            color="info"
          />
        </Col>
        <Col md={3}>
          <StatsCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="fas fa-clock"
            color="warning"
          />
        </Col>
      </Row>
{/* 
      <Row>
        <Col md={12}>
          <CategoryChart categories={categories} products={products} />
        </Col>
      </Row> */}
    </div>
  );
};

export default Dashboard;
