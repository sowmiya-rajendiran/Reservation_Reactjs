import axios from "axios";

const baseURL = `https://reservation-nodejs.onrender.com`;
// const baseURL = `http://localhost:3005`;

let Instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    timeout: 5000 
})

Instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default Instance;