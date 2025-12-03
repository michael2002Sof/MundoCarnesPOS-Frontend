// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout:  60000
});


// ---- INTERCEPTOR DE REINTENTOS ---- //
api.interceptors.response.use(
  (response) => response, // si responde correctamente, devolverlo
  async (error) => {
    const config = error.config;

    // Si no hay config, no se puede reintentar
    if (!config) {
      return Promise.reject(error);
    }

    // Crear contador si no existe
    config.__retryCount = config.__retryCount || 0;

    // Detectar timeout o fallo de conexión
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.message?.includes("timeout") ||
      error.message?.includes("Network Error");

    if (isTimeout && config.__retryCount < 2) {
      config.__retryCount++;

      console.warn(
        `Timeout o fallo de red. Reintentando (${config.__retryCount}/2)...`
      );

      // pequeño delay antes de reintentar
      await new Promise((resolve) => setTimeout(resolve, 300));

      return api.request(config);
    }

    // Si ya no se puede reintentar, rechazar el error real
    return Promise.reject(error);
  }
);



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