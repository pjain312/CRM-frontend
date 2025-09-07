import React, { useState, useEffect } from 'react';
import { getAllAppointments } from '../../services/appointment.service';
import { convertArrayKeysToCamelCase } from '../../utils/common';
import AppointmentsGrid from './AppointmentsGrid';
import '../Leads/lead.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAppointments();
      const convertedData = convertArrayKeysToCamelCase(data);
      setAppointments(convertedData);
    } catch (err) {
      setError('Failed to fetch appointments data');
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) => {
    if (!filterText) return data;

    return data.filter(appointment => 
      Object.values(appointment).some(value => 
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  };

  const filteredAppointments = filterData(appointments);

  if (loading) {
    return (
      <div className="leads-container">
        <div className="loading-spinner">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leads-container">
        <div className="error-message">
          {error}
          <button onClick={fetchAppointments} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="leads-container">
      <div className="page-header">
        <h1>Appointments</h1>
        <p>Manage and view all patient appointments</p>
      </div>
      
      <AppointmentsGrid 
        appointments={filteredAppointments}
        filterText={filterText}
        setFilterText={setFilterText}
        onRefresh={fetchAppointments}
      />
    </div>
  );
};

export default Appointments;
