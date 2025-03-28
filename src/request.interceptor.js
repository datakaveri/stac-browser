import config from "../config";
import axios from "axios";

const apiClient = axios.create({
  baseURL: config["dxConfig"]["dxUrl"], // Change this to your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});


// Add request interceptor
apiClient.interceptors.request.use(

  (config) => {
    const token = localStorage.getItem('token');
    console.log("Interceptor : ", token);
  
    const regex = /collections\/[a-f0-9-]+\/items\/[a-f0-9-]+/i;

    console.log(config.url);
    if (regex.test(config.url)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
