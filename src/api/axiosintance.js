// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout:  90000
});


const axiosInstance = {
  async get(url, config = {}) {
    try {
      const response = await api.get(url, config);
      return response?.data;
    } catch (error) {
      console.error("Error in GET request:", error?.response?.data);
      throw error?.response?.data;
    }
  },

  async post(url, data, config = {}) {
    try {
      const isForm = data instanceof FormData;

      const response = await api.post(url, data, {
        ...config,
        headers: {
          ...(isForm ? {} : { "Content-Type": "application/json" }),
          ...(config.headers || {}),
        },
      });

      return response?.data;
    } catch (error) {
      console.error("Error in POST request:", error.response.data);
      throw error?.response?.data;
    }
  },

  async put(url, data, config = {}) {
    try {
      const isForm = data instanceof FormData;

      const response = await api.put(url, data, {
        ...config,
        headers: {
          ...(isForm ? {} : { "Content-Type": "application/json" }),
          ...(config.headers || {}),
        },
      });

      return response?.data;
    } catch (error) {
      console.error("Error in PUT request:", error?.response?.data || error);
      throw error?.response?.data || error;
    }
  },
  
  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config);
      return response?.data;
    } catch (error) {
      console.error("Error in DELETE request:", error?.response?.data || error);
      throw error?.response?.data || error;
    }
  },
};

export default axiosInstance;