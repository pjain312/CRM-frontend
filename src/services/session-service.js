import api from "../api/axiosUtil";
import config from "../config/environment";

const API_BASE_URL = `${config.api.baseURL}/sessions`;

export const checkinPatient = async (sessionData) => {
  try {
    const response = await api.request({
      method: "POST",
      url: `${API_BASE_URL}/checkInPatient`,
      data: sessionData,
    });
    return response.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};

export const startSession = async (sessionId) => {
  try {
    const response = await api.request({
      method: "PUT",
      url: `${API_BASE_URL}/startSession`,
      data: {sessionId},
    });
    return response.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};

export const endSession = async (sessionId) => {
  try {
    const response = await api.request({
      method: "PUT",
      url: `${API_BASE_URL}/endSession`,
      data: {sessionId},
    });
    return response.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};

export const getPatientDetailsForCheckout = async (sessionId) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getPatientDetailsForCheckout`,
      params: sessionId,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};


export const getAllPackagesAndSessionTypes = async () => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getAllPackagesAndSessionTypes`,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};

export const checkoutPatient = async (checkoutData) => {
  try {
    const response = await api.request({
      method: "PUT",
      url: `${API_BASE_URL}/checkoutPatient`,
      data: checkoutData,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};