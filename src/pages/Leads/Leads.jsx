import React, { useState } from 'react';
import LeadModal from './LeadModal';
import './lead.css';

const Leads = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="leads-container">
      <div className="leads-header">
        <button className="add-lead-button" onClick={handleOpenModal}>
          Add New Lead
        </button>
      </div>
      {isModalOpen && <LeadModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Leads; 