import React, { useState, useEffect } from "react";
import { useLeads } from './LeadsContext';
import { addPatientLead, getLeadDefaultOptions, updatePatientLeads } from "../../services/patientLeads.service";
import "./lead.css";

const LeadModal = ({ onClose, editingLead, setEditingLead}) => {
  const [leadData, setLeadData] = useState({
    name: null,
    age: null,
    gender: null,
    email: null,
    phoneNumber: null,
    address: null,
    city: null,
    state: null,
    pincode: null,
    country: null,
    leadType: null,
    physioPreference: null,
    leadSource: null,
    leadStatus: null,
    condition: null,
    treatment: null,
    assignedTo: null,
  });
  const [leadDefaultOptions, setLeadDefaultOptions] = useState({});

  useEffect(()=>{
    (async()=>{
      const leadOptions = await getLeadDefaultOptions();
      setLeadDefaultOptions(leadOptions)
    })()
  },[])

  useEffect(() => {
    if (editingLead) {
      setLeadData({
        name: editingLead.name || null,
        age: editingLead.age || null,
        gender: editingLead.genderId || null,
        email: editingLead.email || null,
        phoneNumber: editingLead.phoneNumber || null,
        address: editingLead.address || null,
        city: editingLead.city || null,
        state: editingLead.state || null,
        pincode: editingLead.pincode || null,
        country: editingLead.country || null,
        leadType: editingLead.leadType || null,
        physioPreference: editingLead.physioPreference,
        leadSource: editingLead.source || null,
        leadStatus: editingLead.leadStatus || null,
        condition: editingLead.condition || null,
        treatment: editingLead.treatmentTypeId || null,
        assignedTo: editingLead.assignedTo || null,
      });
    } else {
      // Reset form for new lead
      setLeadData({
        name: null,
        age: null,
        gender: null,
        email: null,
        phoneNumber: null,
        address: null,
        city: null,
        state: null,
        pincode: null,
        country: null,
        leadType: null,
        physioPreference: null,
        leadSource: null,
        leadStatus: null,
        condition: null,
        treatment: null,
        assignedTo: null,
      });
    }
  }, [editingLead]);

  const handleClose = () => {
    setEditingLead(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (editingLead) {
        await updatePatientLeads({...leadData, id: editingLead.id});
      } else {
        await addPatientLead(leadData);
      }
      setEditingLead(null);
      onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        <div className="lead-modal-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  value={leadData.name || ""}
                  onChange={(e) => setLeadData({ ...leadData, name: e.target.value || null })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  className="lead-modal-input"
                  type="number"
                  value={leadData.age || ""}
                  onChange={(e) => setLeadData({ ...leadData, age: e.target.value || null })}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select 
                  className="lead-modal-input" 
                  value={leadData.gender || ""} 
                  onChange={(e) => setLeadData({ ...leadData, gender: e.target.value === "null" ? null : e.target.value })}
                >
                  <option value={null}>Select Gender</option>
                  {leadDefaultOptions?.genders?.map((gender) => (
                    <option key={gender.Id} value={gender.Id}>{gender.Name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="lead-modal-input"
                  type="email"
                  value={leadData.email || ""}
                  onChange={(e) => setLeadData({ ...leadData, email: e.target.value || null })}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  className="lead-modal-input"
                  type="tel"
                  value={leadData.phoneNumber || ""}
                  onChange={(e) => setLeadData({ ...leadData, phoneNumber: e.target.value || null })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  value={leadData.address || ""}
                  onChange={(e) => setLeadData({ ...leadData, address: e.target.value || null })}
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
                  value={leadData.city || ""}
                  onChange={(e) => setLeadData({ ...leadData, city: e.target.value || null })}
                  placeholder="Enter city"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  value={leadData.state || ""}
                  onChange={(e) => setLeadData({ ...leadData, state: e.target.value || null })}
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
                  value={leadData.pincode || ""}
                  onChange={(e) => setLeadData({ ...leadData, pincode: e.target.value || null })}
                  placeholder="Enter pincode"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  className="lead-modal-input"
                  type="text"
                  value={leadData.country || ""}
                  onChange={(e) => setLeadData({ ...leadData, country: e.target.value || null })}
                  placeholder="Enter country"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select 
                  className="lead-modal-input" 
                  value={leadData.leadType || ""} 
                  onChange={(e) => setLeadData({ ...leadData, leadType: e.target.value === "null" ? null : e.target.value })}
                >
                  <option value={null}>Select Type</option>
                  {leadDefaultOptions?.leadTypes?.map((leadType) => (
                    <option key={leadType.Id} value={leadType.Id}>{leadType.Name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Physio Preference</label>
                <select 
                  className="lead-modal-input" 
                  value={leadData.physioPreference || ""} 
                  onChange={(e) => setLeadData({ ...leadData, physioPreference: e.target.value === "null" ? null : e.target.value })}
                >
                  <option value={null}>Select Physio Preference</option>
                  {leadDefaultOptions?.physioPreference?.map((physioPreference) => (
                    <option key={physioPreference.Id} value={physioPreference.Id}>{physioPreference.Name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Source</label>
                <select 
                  className="lead-modal-input" 
                  value={leadData.leadSource || ""} 
                  onChange={(e) => setLeadData({ ...leadData, leadSource: e.target.value === "null" ? null : e.target.value })}
                >
                  <option value={null}>Select Source</option>
                  {leadDefaultOptions?.leadSource?.map((leadSource) => (
                    <option key={leadSource.Id} value={leadSource.Id}>{leadSource.Name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  className="lead-modal-input" 
                  value={leadData.leadStatus || ""} 
                  onChange={(e) => setLeadData({ ...leadData, leadStatus: e.target.value === "null" ? null : e.target.value })}
                >
                  <option value={null}>Select Status</option>
                  {leadDefaultOptions?.leadStatus?.map((leadStatus) => (
                    <option key={leadStatus.Id} value={leadStatus.Id}>{leadStatus.Name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Chief Complaint</label>
                <textarea
                  className="lead-modal-input"
                  type="text"
                  value={leadData.condition || ""}
                  onChange={(e) => setLeadData({ ...leadData, condition: e.target.value || null })}
                  placeholder="Enter chief complaint"
                />
              </div>
              <div className="form-group">
                <label>Preferred Treatment</label>
                <select 
                  className="lead-modal-input" 
                  value={leadData.treatment || ""} 
                  onChange={(e) => setLeadData({ ...leadData, treatment: e.target.value === "null" ? null : e.target.value })}
                >
                  <option value={null}>Select Treatment</option>
                  {leadDefaultOptions?.treatmentType?.map((treatment) => (
                    <option key={treatment.Id} value={treatment.Id}>{treatment.Name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Assigned To</label>
                <select 
                  className="lead-modal-input" 
                  value={leadData.assignedTo || ""} 
                  onChange={(e) => setLeadData({ ...leadData, assignedTo: e.target.value === "null" ? null : e.target.value, leadStatus: 2 })}
                >
                  <option value={null}>Select Clinic</option>
                  {leadDefaultOptions?.clinicList?.map((clinic) => (
                    <option key={clinic.Id} value={clinic.Id}>{clinic.Name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="modal-cancel" onClick={handleClose}>
                Cancel
              </button>
              <button className="modal-submit" type="submit">
                {editingLead ? 'Update Lead' : 'Add Lead'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
