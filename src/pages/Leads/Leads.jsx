import React, { useState } from 'react';
import './lead.css';
import LeadModal from './LeadModal';
import FollowUpModal from './FollowUpModal';
import { LeadsProvider, useLeads } from './LeadsContext';
import LeadsGrid from './leadsGrid';

const LeadsContent = () => {
  const {
    isModalOpen, 
    setIsModalOpen,
    isFollowUpModalOpen,
    setIsFollowUpModalOpen,
    selectedLeadId,
    setSelectedLeadId
  } = useLeads();
  const [editingLead, setEditingLead] = useState(null);

  const openModal = () =>{
    setIsModalOpen(true)
  }

  const closeModal = () =>{
    setIsModalOpen(false)
  }

  const closeFollowUpModal = () => {
    setIsFollowUpModalOpen(false);
    setSelectedLeadId(null);
  }

  return (
    <div className="leads-container">
      <div className="leads-header">
        <button className="add-lead-button" onClick={openModal}>
          Add New Lead
        </button>
      </div>
      <LeadsGrid setEditingLead={setEditingLead}/>
      {isModalOpen && <LeadModal onClose={closeModal} editingLead={editingLead} setEditingLead={setEditingLead} />}
      {isFollowUpModalOpen && <FollowUpModal patientId={selectedLeadId} onClose={closeFollowUpModal} />}
    </div>
  );
};

const Leads = () => {
  return (
    <LeadsProvider>
      <LeadsContent />
    </LeadsProvider>
  );
};

export default Leads; 