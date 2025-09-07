import React, { useEffect } from 'react';
import { useLeads } from './LeadsContext';
import { getPatientLeads } from '../../services/patientLeads.service';
import { convertArrayKeysToCamelCase } from '../../utils/common';
import './lead.css';

const LeadsGrid = ({setEditingLead}) => {
  const { 
    leads, 
    setLeads,
    loading, 
    setLoading,
    error, 
    setError,
    filterText, 
    setFilterText,
    setIsModalOpen,
    setSelectedLeadId,
    setIsFollowUpModalOpen
  } = useLeads();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatientLeads();
      const convertedData = convertArrayKeysToCamelCase(data);
      setLeads(convertedData);
    } catch (err) {
      setError('Failed to fetch leads data');
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) => {
    if (!filterText) return data;

    return data.filter(lead => 
      Object.values(lead).some(value => 
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  };

  const filteredLeads = filterData(leads);

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleFollowUpLead = (lead) => {
    setSelectedLeadId(lead.id);
    setIsFollowUpModalOpen(true);
  };

  if (loading) {
    return (
      <div className="leads-grid-container">
        <div className="loading-spinner">Loading leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leads-grid-container">
        <div className="error-message">
          {error}
          <button onClick={fetchLeads} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="leads-grid-container">
      <div className="grid-header">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search leads..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="search-input"
          />
          <span className="results-count">
            {filteredLeads.length} of {leads.length} leads
          </span>
        </div>
        <button onClick={fetchLeads} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      <div className="table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Condition</th>
              <th>Treatment</th>
              <th>Status</th>
              <th>Source</th>
              <th>Physio Preference</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="13" className="no-data">
                  {filterText ? 'No leads match your search criteria' : 'No leads found'}
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead, index) => (
                <tr key={lead.id || index} className="lead-row">
                  <td>{lead.name || '-'}</td>
                  <td>{lead.age || '-'}</td>
                  <td>
                    <span className={`gender-badge ${lead.gender?.toLowerCase()}`}>
                      {lead.gender || '-'}
                    </span>
                  </td>
                  <td className="email-cell">
                    {lead.email || "-"}
                  </td>
                  <td className="phone-cell">
                    {lead.phoneNumber || "-"}
                  </td>
                  <td>{lead.city || '-'}</td>
                  <td className="condition-cell">
                    <span className="condition-text">{lead.condition || '-'}</span>
                  </td>
                  <td>
                    <span className={`treatment-badge ${lead.treatment?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {lead.treatment || '-'}
                    </span>
                  </td>
                  <td>{lead.leadStatusName || '-'}</td>
                  <td>{lead.sourceName || '-'}</td>
                  <td>{lead.physioPreferenceName || '-'}</td>
                  <td>{lead.leadTypeName || '-'}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEditLead(lead)}
                        title="Edit Lead"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn followup-btn" 
                        onClick={() => handleFollowUpLead(lead)}
                        title="Follow Up"
                      >
                        📞
                      </button>
                      <button 
                        className="action-btn assign-btn" 
                        onClick={() => handleEditLead(lead)}
                        title="Assign Lead"
                      >
                        👤
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsGrid;