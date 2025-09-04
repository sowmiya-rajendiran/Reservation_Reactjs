import axios from "axios";

const baseURL = `https://reservation-nodejs.onrender.com`;
// const baseURL = `http://localhost:3005/api`;

let Instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    timeout: 5000 
})

export default Instance;