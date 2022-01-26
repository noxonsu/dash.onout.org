import axios from "axios";

// Set config defaults when creating the instance
const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.64:5000'
});

export default axiosInstance;