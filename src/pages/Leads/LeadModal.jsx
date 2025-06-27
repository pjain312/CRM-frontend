import React from "react";
import "./lead.css";

const LeadModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Lead</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="lead-modal-form">
          <form>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  className="lead-modal-input"
                  type="number"
                  placeholder="Enter age"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select className="lead-modal-input">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="lead-modal-input"
                  type="email"
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  className="lead-modal-input"
                  type="tel"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  placeholder="Enter address"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  placeholder="Enter city"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  placeholder="Enter state"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Pincode</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  placeholder="Enter pincode"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  placeholder="Enter country"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Chief Complaint</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  placeholder="Enter chief complaint"
                />
              </div>
              <div className="form-group">
                <label>Preffered Service</label>
                <select className="lead-modal-input">
                  <option value="">Select Service</option>
                  <option value="physiotherapy">Physio Therapy</option>
                  <option value="chiropractic">Chiropractic</option>
                  <option value="cupping therapy">Cupping Therapy</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="modal-submit" type="submit">
                Add Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
