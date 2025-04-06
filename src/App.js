import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Viruses from './pages/Viruses';
import './assets/styles/App.css';
import Cart from './utils/Cart';


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/viruses" element={<Viruses />} />
        <Route path="/cart" element= {<Cart/>}/>
      </Routes>
    </Layout>
  );
}

export default App;