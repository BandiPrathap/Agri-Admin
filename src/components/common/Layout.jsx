import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, onLogout }) => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content area */}
      <div className="flex-grow-1" style={{ marginLeft: '100px' }}>
        {/* Header */}
        <Header onLogout={onLogout} />

        {/* Main content */}
        <main className="container">
          {children}
        </main>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 767.98px) {
          .flex-grow-1 {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
