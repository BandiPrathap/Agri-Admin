import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Card className={`border-0 bg-${color} text-white`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-0">{title}</h6>
            <h2 className="mb-0">{value}</h2>
          </div>
          <div>
            <i className={`${icon} fa-3x opacity-50`}></i>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;