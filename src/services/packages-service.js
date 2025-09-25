import axios from "axios";

const API_BASE_URL = "http://localhost:9005/packages";

export const addPackage = async (packageData) => {
  const response = await axios.request({
    method: "POST",
    url: `${API_BASE_URL}/addPackage`,
    data: packageData,
  });
  return response.data;
};

export const updatePackage = async (packageData) => {
  const response = await axios.request({
    method: "PUT",
    url: `${API_BASE_URL}/updatePackage`,
    data: packageData,
  });
  return response.data;
};

export const getPackages = async () => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_BASE_URL}/getPackages`,
    });
    return response.data.data;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};

export const deletePackage = async (packageId) => {
  try {
    const response = await axios.request({
      method: "DELETE",
      url: `${API_BASE_URL}/deletePackage`,
      data: {packageId}
    });
    return response.data.x;
  } catch (error) {
    console.warn("API data not available", error.message);
  }
};