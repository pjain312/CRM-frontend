import React, { useEffect } from 'react';
import { usePatientLists } from './PatientListsContext';
import { getRegisteredPatients } from '../../services/patientLeads.service';
import { convertArrayKeysToCamelCase } from '../../utils/common';
import '../Leads/lead.css';

const PatientListsGrid = ({setEditingLead}) => {
  const { 
    patients, 
    setPatients,
    loading, 
    setLoading,
    error, 
    setError,
    filterText, 
    setFilterText,
    setIsLeadModalOpen,
    setIsAppointmentModalOpen,
    setIsAppointmentsViewModalOpen,
    setSelectedPatientId,
    setSelectedPatientDetails
  } = usePatientLists();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRegisteredPatients();
      const convertedData = convertArrayKeysToCamelCase(data);
      setPatients(convertedData);
    } catch (err) {
      setError('Failed to fetch patients data');
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) => {
    if (!filterText) return data;

    return data.filter(patient => 
      Object.values(patient).some(value => 
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  };

  const filteredPatients = filterData(patients);

  const handleEditPatient = (patient) => {
    setEditingLead(patient);
    setIsLeadModalOpen(true);
  };

  const handleAppointmentClick = (patient) => {
    setSelectedPatientId(patient.id);
    setSelectedPatientDetails(patient);
    setIsAppointmentModalOpen(true);
  };

  const handleViewAppointments = (patient) => {
    setSelectedPatientId(patient.id);
    setSelectedPatientDetails(patient);
    setIsAppointmentsViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="leads-grid-container">
        <div className="loading-spinner">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leads-grid-container">
        <div className="error-message">
          {error}
          <button onClick={fetchPatients} className="retry-button">Retry</button>
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
            placeholder="Search patients..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="search-input"
          />
          <span className="results-count">
            {filteredPatients.length} of {patients.length} patients
          </span>
        </div>
        <button onClick={fetchPatients} className="refresh-button">
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
              <th>Assigned To</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="12" className="no-data">
                  {filterText ? 'No patients match your search criteria' : 'No patients found'}
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient, index) => (
                <tr key={patient.id || index} className="lead-row">
                  <td>{patient.name || '-'}</td>
                  <td>{patient.age || '-'}</td>
                  <td>
                    <span className={`gender-badge ${patient.gender?.toLowerCase()}`}>
                      {patient.gender || '-'}
                    </span>
                  </td>
                  <td className="email-cell">
                    {patient.email || "-"}
                  </td>
                  <td className="phone-cell">
                    {patient.phoneNumber || "-"}
                  </td>
                  <td>{patient.city || '-'}</td>
                  <td className="condition-cell">
                    <span className="condition-text">{patient.condition || '-'}</span>
                  </td>
                  <td>
                    <span className={`treatment-badge ${patient.treatment?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {patient.treatment || '-'}
                    </span>
                  </td>
                  <td>{patient.leadStatusName || '-'}</td>
                  <td>{patient.assignedToName || '-'}</td>
                  <td>{patient.lastVisit || '-'}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEditPatient(patient)}
                        title="Edit Patient"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn appointment-btn" 
                        onClick={() => handleAppointmentClick(patient)}
                        title="Schedule Appointment"
                      >
                        📅
                      </button>
                      <button 
                        className="action-btn appointments-view-btn" 
                        onClick={() => handleViewAppointments(patient)}
                        title="View Appointments"
                      >
                        📋
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

export default PatientListsGrid;
