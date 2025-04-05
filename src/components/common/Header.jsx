import React from 'react';

const Header = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Welcome to AgriAdmin</h5>
      <button onClick={onLogout} className="btn btn-outline-danger btn-sm">
        <i className="fas fa-sign-out-alt me-2"></i> Logout
      </button>
    </header>
  );
};

export default Header;
