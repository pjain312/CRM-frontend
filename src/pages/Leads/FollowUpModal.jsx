import React, { useEffect, useState } from 'react';
import './lead.css';
import { getLeadDetailsForFollowUp, saveFollowUpData } from '../../services/patientLeads.service';
import { format } from 'date-fns';

const FollowUpModal = ({ patientId, onClose }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followUpData, setFollowUpData] = useState({
    currentFollowUpComment: '',
    nextFollowUpDate: ''
  });
  const [saving, setSaving] = useState(false);

  // Function to format date using date-fns
  const formatDate = (dateString) => {
    if (!dateString) return 'No previous follow-up date';
    
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await getLeadDetailsForFollowUp({ id: patientId });
      setPatientDetails(details);
    } catch (err) {
      setError('Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFollowUpData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveFollowUpData({
        leadId: patientId,
        followUpComment: followUpData.currentFollowUpComment,
        nextFollowUpDate: followUpData.nextFollowUpDate
      });
      onClose();
    } catch (err) {
      setError('Failed to save follow-up data');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFollowUpData({
      currentFollowUpComment: '',
      nextFollowUpDate: ''
    });
    onClose();
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Follow Up Details</h2>
            <button className="modal-close" onClick={handleClose}>×</button>
          </div>
          <div className="followup-modal-content">
            <div className="loading-spinner">Loading patient details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Follow Up Details</h2>
            <button className="modal-close" onClick={handleClose}>×</button>
          </div>
          <div className="followup-modal-content">
            <div className="error-message">
              {error}
              <button onClick={fetchPatientDetails} className="retry-button">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content followup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Follow Up Details</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <div className="followup-modal-content">
          {/* Patient Information Display */}
          <div className="patient-info-section">
            <h3>Patient Information</h3>
            <div className="patient-info-grid-followup">
              <div className="info-item info-item-name">
                <label>Name:</label>
                <span>{patientDetails?.Name || '-'}</span>
              </div>
              <div className="info-item info-item-compact">
                <label>Age:</label>
                <span>{patientDetails?.Age || '-'}</span>
              </div>
              <div className="info-item info-item-compact">
                <label>Phone:</label>
                <span>{patientDetails?.PhoneNumber || '-'}</span>
              </div>
              <div className="info-item info-item-comment">
                <label>Last Follow Up Comment:</label>
                <span className="last-comment">
                  {patientDetails?.LastFollowUpComment || 'No previous follow-up comments'}
                </span>
              </div>
              <div className="info-item info-item-date">
                <label>Last Follow Up Date:</label>
                <span>{formatDate(patientDetails?.LastFollowUpDate)}</span>
              </div>
            </div>
          </div>

          {/* Follow Up Form */}
          <div className="followup-form-section">
            <h3>Current Follow Up</h3>
            {patientDetails?.FollowUpCount === 3 ? (
              <div className="max-followup-message">
                <div className="max-followup-text">
                  <span className="max-followup-icon">🔒</span>
                  <span>Maximum follow-ups reached. No further follow-ups allowed.</span>
                </div>
                <div className="disabled-form-fields">
                  <div className="form-group">
                    <label>Follow Up Comment</label>
                    <textarea
                      className="lead-modal-input disabled-input"
                      name="currentFollowUpComment"
                      value=""
                      disabled
                      placeholder="Follow-ups are no longer allowed"
                      rows="4"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Next Follow Up Date</label>
                    <input
                      className="lead-modal-input disabled-input"
                      type="date"
                      name="nextFollowUpDate"
                      value=""
                      disabled
                      placeholder="No more follow-ups scheduled"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Follow Up Comment</label>
                  <textarea
                    className="lead-modal-input"
                    name="currentFollowUpComment"
                    value={followUpData.currentFollowUpComment}
                    onChange={handleInputChange}
                    placeholder="Enter your follow-up comment..."
                    rows="4"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Next Follow Up Date</label>
                  {patientDetails?.FollowUpCount === 2 ? (
                    <div className="last-followup-message">
                      <span className="last-followup-text">This is the last follow-up. The Lead will be closed after this.</span>
                      <input
                        className="lead-modal-input disabled-input"
                        type="date"
                        name="nextFollowUpDate"
                        value=""
                        disabled
                        placeholder="No more follow-ups scheduled"
                      />
                    </div>
                  ) : (
                    <input
                      className="lead-modal-input"
                      type="date"
                      name="nextFollowUpDate"
                      value={followUpData.nextFollowUpDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="modal-cancel" onClick={handleClose}>
                    Cancel
                  </button>
                  <button className="modal-submit" type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Follow Up'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal; 