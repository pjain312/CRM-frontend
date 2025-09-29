import api from "../api/axiosUtil";

const API_BASE_URL = "http://localhost:9005/packages";

export const addPackage = async (packageData) => {
  const response = await api.request({
    method: "POST",
    url: `${API_BASE_URL}/addPackage`,
    data: packageData,
  });
  return response.data;
};

export const updatePackage = async (packageData) => {
  const response = await api.request({
    method: "PUT",
    url: `${API_BASE_URL}/updatePackage`,
    data: packageData,
  });
  return response.data;
};

export const getPackages = async () => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getPackages`,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};

export const getSessionTypes = async () => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getSessionTypes`,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};


export const deletePackage = async (packageId) => {
  try {
    const response = await api.request({
      method: "DELETE",
      url: `${API_BASE_URL}/deletePackage`,
      data: {packageId}
    });
    return response.data.x;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};

export const addSessionType = async (sessionTypeData) => {
  const response = await api.request({
    method: "POST",
    url: `${API_BASE_URL}/addSessionTypes`,
    data: sessionTypeData,
  });
  return response.data;
};

export const updateSessionType = async (sessionTypeData) => {
  const response = await api.request({
    method: "PUT",
    url: `${API_BASE_URL}/updateSessionType`,
    data: sessionTypeData,
  });
  return response.data;
};

export const deleteSessionType = async (sessionId) => {
  try {
    const response = await api.request({
      method: "DELETE",
      url: `${API_BASE_URL}/deleteSessionType`,
      data: {sessionId}
    });
    return response.data.x;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};

export const getPackageInvoiceData = async (params) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getPackageInvoiceData`,
      params: params
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error
  }
};

export const getDailyInvoiceData = async (params) => {
  try {
    const response = await api.request({
      method: "GET",
      url: `${API_BASE_URL}/getDailyInvoiceData`,
      params: params
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
    throw error
  }
};