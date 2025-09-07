import React, { useState } from 'react';
import '../Leads/lead.css';
import { PatientListsProvider, usePatientLists } from './PatientListsContext';
import PatientListsGrid from './patientListsGrid';
import LeadModal from '../Leads/LeadModal';
import AddAppointmentModal from '../Appointment/AddAppointmentModal';
import PatientAppointmentsModal from './PatientAppointmentsModal';

const PatientListsContent = () => {
  const { 
    isLeadModalOpen, 
    setIsLeadModalOpen,
    isAppointmentModalOpen,
    setIsAppointmentModalOpen,
    isAppointmentsViewModalOpen,
    setIsAppointmentsViewModalOpen,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatientDetails,
    setSelectedPatientDetails
  } = usePatientLists();
  const [editingLead, setEditingLead] = useState(null);

  const closeModal = () => {
    setIsLeadModalOpen(false);
  };

  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    setSelectedPatientId(null);
    setSelectedPatientDetails(null);
  };

  const closeAppointmentsViewModal = () => {
    setIsAppointmentsViewModalOpen(false);
    setSelectedPatientId(null);
    setSelectedPatientDetails(null);
  };

  return (
    <div className="leads-container">
      <PatientListsGrid setEditingLead={setEditingLead} />
      {isLeadModalOpen && <LeadModal onClose={closeModal} editingLead={editingLead} setEditingLead={setEditingLead} />}
      {isAppointmentModalOpen && (
        <AddAppointmentModal 
          patientId={selectedPatientId} 
          patientDetails={selectedPatientDetails} 
          onClose={closeAppointmentModal} 
        />
      )}
      {isAppointmentsViewModalOpen && (
        <PatientAppointmentsModal 
          patientId={selectedPatientId} 
          patientDetails={selectedPatientDetails} 
          onClose={closeAppointmentsViewModal} 
        />
      )}
    </div>
  );
};

const PatientLists = () => {
  return (
    <PatientListsProvider>
      <PatientListsContent />
    </PatientListsProvider>
  );
};

export default PatientLists; 