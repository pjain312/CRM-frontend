import React, { createContext, useContext, useState } from 'react';

// Create the context
const PatientListsContext = createContext();

// Custom hook to use the patient lists context
export const usePatientLists = () => {
  const context = useContext(PatientListsContext);
  if (!context) {
    throw new Error('usePatientLists must be used within a PatientListsProvider');
  }
  return context;
};

// Provider component
export const PatientListsProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isAppointmentsViewModalOpen, setIsAppointmentsViewModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);

  const value = {
    patients,
    setPatients,
    loading,
    setLoading,
    error,
    setError,
    filterText,
    setFilterText,
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
  };

  return (
    <PatientListsContext.Provider value={value}>
      {children}
    </PatientListsContext.Provider>
  );
};

export default PatientListsContext;
