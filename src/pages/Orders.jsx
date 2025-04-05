import React, { useState, useEffect } from 'react';
import { Table, Badge, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const statusColors = {
  pending: 'warning',
  completed: 'success',
  shipped: 'info',
  cancelled: 'danger'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        api.getOrders(),
        api.getProducts()
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchData();
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name_en : 'Unknown Product';
  };

  const filteredOrders = filterStatus 
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h3>
          <i className="fas fa-shopping-cart me-2"></i>
          Orders Management
        </h3>
        <div className="d-flex">
          <Form.Select
            style={{ width: '200px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{getProductName(order.product_id)}</td>
              <td>{order.quantity}</td>
              <td>₹{order.total}</td>
              <td>{order.date}</td>
              <td>
                <Badge bg={statusColors[order.status]}>
                  {order.status.toUpperCase()}
                </Badge>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button 
                    variant={order.status === 'pending' ? 'primary' : 'outline-primary'} 
                    size="sm"
                    onClick={() => handleStatusChange(order.id, 'pending')}
                    disabled={order.status === 'pending'}
                  >
                    Pending
                  </Button>
                  <Button 
                    variant={order.status === 'shipped' ? 'info' : 'outline-info'} 
                    size="sm"
                    onClick={() => handleStatusChange(order.id, 'shipped')}
                    disabled={order.status === 'shipped'}
                  >
                    Shipped
                  </Button>
                  <Button 
                    variant={order.status === 'completed' ? 'success' : 'outline-success'} 
                    size="sm"
                    onClick={() => handleStatusChange(order.id, 'completed')}
                    disabled={order.status === 'completed'}
                  >
                    Complete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Orders;