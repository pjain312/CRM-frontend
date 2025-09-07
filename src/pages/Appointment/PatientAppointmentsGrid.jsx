import React, { useState } from 'react';
import { format } from 'date-fns';
import './appointment.css';

const PatientAppointmentsGrid = ({ appointments = [], patientName }) => {
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

  if (appointments.length === 0) {
    return (
      <div className="appointments-grid-section">
        <h3>Appointment History</h3>
        <div className="no-appointments">
          <div className="no-appointments-icon">📅</div>
          <p>No appointments found for this patient</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="appointments-grid-section">
        <div className="appointments-header">
          <h3>Appointment History</h3>
          <span className="appointments-count">{appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="appointments-grid">
          {appointments.map((appointment, index) => (
            <div 
              key={index} 
              className="appointment-card"
              onClick={() => handleAppointmentClick(appointment)}
            >
              <div className="appointment-card-header">
                <div className="appointment-date">
                  <span className="date-text">{format(appointment.AppointmentDate, "dd MMM yyyy")}</span>
                  <span className="time-text">{format(appointment.AppointmentTime, "hh:mm a")}</span>
                </div>
                <div 
                  className="appointment-status"
                  style={{ backgroundColor: getStatusColor(appointment.Status) }}
                >
                  {appointment.Status}
                </div>
              </div>
              
              <div className="appointment-card-body">
                <div className="appointment-type">
                  <span className="type-label">Type:</span>
                  <span className="type-value">{appointment.AppointmentType}</span>
                </div>
                
                {appointment.Comments && (
                  <div className="appointment-comments">
                    <span className="comments-label">Comments:</span>
                    <span className="comments-value">{appointment.Comments}</span>
                  </div>
                )}
              </div>
              
              <div className="appointment-card-footer">
                <span className="click-hint">Click to view details</span>
              </div>
            </div>
          ))}
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
                    <span>{patientName}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Appointment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Date:</label>
                    <span>{format(selectedAppointment.AppointmentDate, "dd MMM yyyy")}</span>
                  </div>
                  <div className="detail-item">
                    <label>Time:</label>
                    <span>{format(selectedAppointment.AppointmentTime, "hh:mm a")}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedAppointment.AppointmentType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedAppointment.Status) }}
                    >
                      {selectedAppointment.Status}
                    </span>
                  </div>
                </div>
              </div>
              
              {selectedAppointment.Comments && (
                <div className="detail-section">
                  <h3>Comments</h3>
                  <div className="comments-detail">
                    <p>{selectedAppointment.Comments}</p>
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

export default PatientAppointmentsGrid;
