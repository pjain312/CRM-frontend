import axios from "axios";

const API_BASE_URL = "http://localhost:9005/sessions";

export const checkinPatient = async (sessionData) => {
  try {
    const response = await axios.request({
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
    const response = await axios.request({
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
    const response = await axios.request({
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