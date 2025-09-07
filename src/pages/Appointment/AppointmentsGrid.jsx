import React, { useState } from 'react';
import { format } from 'date-fns';
import '../Leads/lead.css';

const AppointmentsGrid = ({ appointments = [], filterText, setFilterText, onRefresh }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return '#429fb6';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      case 'rescheduled':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  return (
    <>
      <div className="leads-grid-container">
        <div className="grid-header">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search appointments..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="search-input"
            />
            <span className="results-count">
              {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button onClick={onRefresh} className="refresh-button">
            🔄 Refresh
          </button>
        </div>

        <div className="table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    {filterText ? 'No appointments match your search criteria' : 'No appointments found'}
                  </td>
                </tr>
              ) : (
                appointments.map((appointment, index) => (
                  <tr key={appointment.id || index} className="lead-row">
                    <td className="patient-name-cell">
                      <div className="patient-info">
                        <span className="patient-name">{appointment.name || '-'}</span>
                        <span className="patient-details">
                          {appointment.age && `${appointment.age} years`}
                          {appointment.gender && ` • ${appointment.gender}`}
                        </span>
                      </div>
                    </td>
                    <td>{format(appointment.appointmentDate, "dd MMM yyyy")}</td>
                    <td>{appointment?.appointmentTime}</td>
                    <td>
                      <span className="appointment-type-badge">
                        {appointment.appointmentType || '-'}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="appointment-status-badge"
                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                      >
                        {appointment.status || '-'}
                      </span>
                    </td>
                    <td className="comments-cell">
                      <span className="comments-text">
                        {appointment.comments || '-'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn" 
                          onClick={() => handleAppointmentClick(appointment)}
                          title="View Details"
                        >
                          👁️
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

      {/* Appointment Detail Modal */}
      {showModal && selectedAppointment && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content appointment-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="appointment-detail-content">
              <div className="detail-section">
                <h3>Patient Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Patient Name:</label>
                    <span>{selectedAppointment.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Age:</label>
                    <span>{selectedAppointment.age || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Gender:</label>
                    <span>{selectedAppointment.gender || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedAppointment.phoneNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Appointment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Date:</label>
                    <span>{format(selectedAppointment.appointmentDate, "dd MMM yyyy")}</span>
                  </div>
                  <div className="detail-item">
                    <label>Time:</label>
                    <span>{selectedAppointment.appointmentTime}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedAppointment.appointmentType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedAppointment.status) }}
                    >
                      {selectedAppointment.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {selectedAppointment.comments && (
                <div className="detail-section">
                  <h3>Comments</h3>
                  <div className="comments-detail">
                    <p>{selectedAppointment.comments}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="modal-cancel" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsGrid;
