import { format, parse } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { getAllAppointments } from '../../services/appointment.service';
import { convertArrayKeysToCamelCase } from '../../utils/common';
import '../Appointment/appointment.css';

const PatientAppointmentsModal = ({ patientId, patientDetails, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [patientId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAppointments({ patientId });
      const convertedData = convertArrayKeysToCamelCase(data);
      setAppointments(convertedData || []);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

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
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Patient Appointments</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="appointment-modal-content">
            <div className="loading-spinner">Loading appointments...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content appointments-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Patient Appointments</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          
          <div className="appointment-modal-content">
            {/* Patient Information */}
            <div className="patient-info-section">
              <h3>Patient Information</h3>
              <div className="patient-info-grid">
                <div className="info-item info-item-name">
                  <label>Patient Name:</label>
                  <span>{patientDetails?.name || 'Unknown Patient'}</span>
                </div>
                <div className="info-item info-item-compact">
                  <label>Age:</label>
                  <span>{patientDetails?.age || 'N/A'}</span>
                </div>
                <div className="info-item info-item-compact">
                  <label>Gender:</label>
                  <span>{patientDetails?.gender || 'N/A'}</span>
                </div>
                <div className="info-item info-item-compact">
                  <label>Phone:</label>
                  <span>{patientDetails?.phoneNumber || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Appointments Grid */}
            <div className="appointments-grid-section">
              <div className="appointments-header">
                <h3>Appointment History</h3>
                <span className="appointments-count">{appointments?.length} appointment{appointments?.length !== 1 ? 's' : ''}</span>
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                  <button onClick={fetchAppointments} className="retry-button">Retry</button>
                </div>
              )}
              
              {appointments?.length === 0 ? (
                <div className="no-appointments">
                  <div className="no-appointments-icon">📅</div>
                  <p>No appointments found for this patient</p>
                </div>
              ) : (
                <div className="appointments-grid">
                  {appointments?.map((appointment, index) => (
                    <div 
                      key={index} 
                      className="appointment-card"
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="appointment-card-header">
                        <div className="appointment-date-time">
                          <span>{format(appointment.appointmentDate, "dd MMM yyyy")}</span>
                          <span>{ appointment.appointmentTime }</span>
                        </div>
                        <div 
                          className="appointment-status"
                          style={{ backgroundColor: getStatusColor(appointment.status) }}
                        >
                          {appointment.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="modal-overlay" onClick={handleCloseDetailModal}>
          <div className="modal-content appointment-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button className="modal-close" onClick={handleCloseDetailModal}>×</button>
            </div>
            
            <div className="appointment-detail-content">
              <div className="detail-section">
                <h3>Patient Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Patient Name:</label>
                    <span>{patientDetails?.name}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Appointment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Date:</label>
                    <span>{format(selectedAppointment?.appointmentDate, "dd MMM yyyy")}</span>
                  </div>
                  <div className="detail-item">
                    <label>Time:</label>
                    <span>{selectedAppointment?.appointmentTime}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedAppointment?.appointmentType}</span>
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
              <button className="modal-cancel" onClick={handleCloseDetailModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientAppointmentsModal;
