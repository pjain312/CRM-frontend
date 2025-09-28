import axios from "axios";

const API_URL = "http://localhost:9005/appointments";

export const getAppointmentDefaultOptions = async () => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_URL}/getAppointmentDefaultOptions`,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};

export const addAppointment = async (data) => {
  try {
    const response = await axios.request({
      method: "POST",
      url: `${API_URL}/addAppointment`,
      data: data,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};

export const getAllAppointments = async (params) => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_URL}/getAllAppointments`,
      params: params,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};

export const updateAppointment = async (data) => {
  try {
    const response = await axios.request({
      method: "POST",
      url: `${API_URL}/updateAppointment`,
      data: data,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};

export const getPendingCounts = async () => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_URL}/getPendingCounts`,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error; 
  }
};
