import api from "../api/axiosUtil";
import config from "../config/environment";

const API_BASE_URL = `${config.api.baseURL}/payments`;

// Get all payments with optional month and year filter
export const getAllPayments = async (params = {}) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getAllPayments`,
      params: params,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};

export const getTotalMonthlyCollection = async (params = {}) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getTotalMonthlyCollection`,
      params: params,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error;
  }
};

