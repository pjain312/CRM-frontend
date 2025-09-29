import api from "../api/axiosUtil";

const API_URL = "http://localhost:9005/patientLeads";

export const addPatientLead = async (leadData) => {
  const response = await api.request({
    method: "POST",
    url: `${API_URL}/addPatientLeads`,
    data: leadData,
  });
  return response.data;
};

export const updatePatientLeads = async (leadData) => {
  const response = await api.request({
    method: "POST",
    url: `${API_URL}/updatePatientLeads`,
    data: leadData,
  });
  return response.data;
};

export const getPatientLeads = async () => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_URL}/getPatientLeads`,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};

export const getRegisteredPatients = async () => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_URL}/getRegisteredPatients`,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};

export const getLeadDefaultOptions = async () => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_URL}/getLeadsDetailsOptions`,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};

export const getLeadDetailsForFollowUp = async (params) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_URL}/getLeadDetailsForFollowUp`,
      params: params,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};

export const saveFollowUpData = async (data) => {
  try {
    const response = await api.request({
      method: "POST",
      url: `${API_URL}/addLeadsFollowUp`,
      data: data,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};

export const closePatient = async (data) => {
  try {
    const response = await api.request({
      method: "POST",
      url: `${API_URL}/closePatient`,
      data: data,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};

