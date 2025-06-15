import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.PUBLIC_API_BASE,
});

api.defaults.withCredentials = true;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
