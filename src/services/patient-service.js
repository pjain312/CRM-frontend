import api from "../api/axiosUtil";
import config from "../config/environment";

const API_BASE_URL = `${config.api.baseURL}/patients`;

export const getPatientDetails = async (patientId) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getPatientDetails`,
      params: {patientId}
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};

export const getPatientAppointments = async (patientId) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getPatientAppointment`,
      params: {patientId},
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};

export const getPatientTransactions = async (patientId) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getPatientTransactions`,
      params: {patientId},
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};

// Get patient packages
export const getPatientPackages = async (patientId) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getPatientPackages`,
      params: {patientId},
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};

// Update patient details
export const payPackageDues = async (paymentData) => {
  try {
    const response = await api.request({
      method: "POST",
      url: `${API_BASE_URL}/payPackageDues`,
      data: paymentData,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};

// Add patient payment
export const addPatientPayment = async (patientId, paymentData) => {
  try {
    const response = await api.request({
      method: "POST",
      url: `${API_BASE_URL}/${patientId}/payments`,
      data: paymentData,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};

// Assign package to patient
export const assignPackageToPatient = async (patientId, packageData) => {
  try {
    const response = await api.request({
      method: "POST",
      url: `${API_BASE_URL}/${patientId}/packages`,
      data: packageData,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};

// Get patient statistics
export const getPatientStatistics = async (patientId) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/${patientId}/statistics`,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};

// Get patient session history
export const getPatientSessions = async (patientId, params = {}) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/${patientId}/sessions`,
      params: params,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};
