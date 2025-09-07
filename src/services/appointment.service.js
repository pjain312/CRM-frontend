import axios from "axios";

const API_URL = "http://localhost:9005/appointments";

export const getAppointmentDefaualtOptions = async () => {
    try {
        const response = await axios.request({
            method:"GET",
            url: `${API_URL}/getAppointmentDefaultOptions`,
        })
        return response.data.data;
    }
    catch (error) {
        console.warn('API data not available', error.message);
    }
}

export const addAppointment = async (data) => {
    try {
        const response = await axios.request({
            method:"POST",
            url: `${API_URL}/addAppointment`,
            data: data
        })
        return response.data.data;
    }
    catch (error) {
        console.warn('API data not available', error.message);
    }
}

export const getAllAppointments = async (params) => {
    try {
        const response = await axios.request({
            method:"GET",
            url: `${API_URL}/getAllAppointments`,
            params: params
        })
        return response.data.data;
    }
    catch (error) {
        console.warn('API data not available', error.message);
    }
}