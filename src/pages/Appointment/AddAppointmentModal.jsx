import React, { useEffect, useState } from 'react';
import { addAppointment, getAppointmentDefaualtOptions } from '../../services/appointment.service';
import './appointment.css';

const AddAppointmentModal = ({ patientId, patientDetails, onClose }) => {
  const [appointmentData, setAppointmentData] = useState({
    patientId: patientId,
    appointmentDate: null,
    appointmentTime: null,
    appointmentType: null,
    comments: null,
    status: null
  });
  const [defaultOptions, setDefaultOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDefaultOptions();
  }, []);

  const fetchDefaultOptions = async () => {
    try {
      setLoading(true);
      const options = await getAppointmentDefaualtOptions();
      setDefaultOptions(options);
    } catch (err) {
      setError('Failed to load appointment options');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({
      ...prev,
      [name]: value === '' ? null : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      // Validate required fields
      if (!appointmentData?.appointmentDate || !appointmentData?.appointmentTime || !appointmentData?.appointmentType) {
        setError('Please fill in all required fields');
        return;
      }

      await addAppointment({...appointmentData, patientId: patientId});
      onClose();
    } catch (err) {
      setError('Failed to save appointment');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setAppointmentData({
      patientId: appointmentData?.id,
      appointmentDate: null,
      appointmentTime: null,
      appointmentType: null,
      comments: null,
      status: null
    });
    setError(null);
    onClose();
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Schedule Appointment</h2>
            <button className="modal-close" onClick={handleClose}>×</button>
          </div>
          <div className="appointment-modal-content">
            <div className="loading-spinner">Loading appointment options...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content appointment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Schedule Appointment</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
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

          {/* Appointment Form */}
          <div className="appointment-form-section">
            <h3>Appointment Details</h3>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Date *</label>
                  <input
                    className="lead-modal-input"
                    type="date"
                    name="appointmentDate"
                    value={appointmentData.appointmentDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Appointment Time *</label>
                  <input
                    className="lead-modal-input"
                    type="time"
                    name="appointmentTime"
                    value={appointmentData.appointmentTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Type *</label>
                  <select
                    className="lead-modal-input"
                    name="appointmentType"
                    value={appointmentData.appointmentType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={null}>Select Appointment Type</option>
                    {defaultOptions?.appointmentTypes?.map(appointmentType => (
                      <option key={appointmentType.Id} value={appointmentType.Id}>{appointmentType.Name}</option>
                    ))}
                  </select>
                </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      className="lead-modal-input"
                      name="status"
                      value={appointmentData.status}
                      onChange={handleInputChange}
                    >
                      <option value={null}>Select Status</option>
                      {defaultOptions?.apointmentStatusList?.map(status => (
                        <option key={status.Id} value={status.Id}>{status.Name}</option>
                      ))}
                    </select>
                  </div>
              </div>

              <div className="form-group">
                <label>Comments</label>
                <textarea
                  className="lead-modal-input"
                  name="comments"
                  value={appointmentData.comments}
                  onChange={handleInputChange}
                  placeholder="Enter any additional notes for this appointment..."
                  rows="4"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="modal-cancel" onClick={handleClose}>
                  Cancel
                </button>
                <button className="modal-submit" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
