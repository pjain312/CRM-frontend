import React, { createContext, useContext, useState } from 'react';

// Create the context
const LeadsContext = createContext();

// Custom hook to use the leads context
export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};

// Provider component
export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const value = {
    leads,
    setLeads,
    loading,
    setLoading,
    error,
    setError,
    filterText,
    setFilterText,
    isModalOpen,
    setIsModalOpen,
    isFollowUpModalOpen,
    setIsFollowUpModalOpen,
    selectedLeadId,
    setSelectedLeadId,
  };

  return (
    <LeadsContext.Provider value={value}>
      {children}
    </LeadsContext.Provider>
  );
};

export default LeadsContext;
