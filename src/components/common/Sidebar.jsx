import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Offcanvas } from 'react-bootstrap';

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const menuItems = [
    { to: '/', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { to: '/products', label: 'Products', icon: 'fas fa-seedling' },
    { to: '/categories', label: 'Categories', icon: 'fas fa-th-large' },
    { to: '/viruses', label: 'Viruses', icon: 'fas fa-virus' },
  ];

  const renderNavLinks = (onClick) =>
    menuItems.map((item, index) => (
      <li className="nav-item my-1" key={index}>
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            `nav-link d-flex align-items-center px-3 py-2 rounded text-white ${
              isActive ? 'bg-gradient bg-secondary fw-bold shadow-sm' : 'hover-bg'
            }`
          }
          end
          onClick={onClick}
        >
          <i className={`${item.icon} me-3`}></i>
          <span>{item.label}</span>
        </NavLink>
      </li>
    ));

  return (
    <>
      {/* Small screen toggle */}
      <div className="d-md-none p-2 bg-dark text-white h-100 m-1 mt-2">
        <Button variant="outline-light" onClick={handleShow} >
          <i className="fas fa-bars"></i>
        </Button>
      </div>

      {/* Sidebar for md+ screens */}
      <div
        className="d-none d-md-flex flex-column bg-dark text-white vh-100 position-fixed p-3 shadow"
        style={{ width: '250px' }}
      >
        <div className="text-center mb-4">
          <h4 className="fw-bold mb-0">
            <i className="fas fa-tractor me-2 text-success"></i>AgriAdmin
          </h4>
        </div>
        <ul className="nav flex-column">{renderNavLinks()}</ul>
      </div>

      {/* Offcanvas for small screens */}
      <Offcanvas show={show} onHide={handleClose} responsive="md" className="bg-dark text-white">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>
            <i className="fas fa-tractor me-2 text-success"></i>AgriAdmin
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="nav flex-column">{renderNavLinks(handleClose)}</ul>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Hover effect */}
      <style>{`
        .hover-bg:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
