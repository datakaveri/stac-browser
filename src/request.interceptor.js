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
    const token = sessionStorage.getItem('dxAAAToken');
    const regex = /collections\/[a-f0-9-]+\/items\/[a-f0-9-]+/i;
    if (token !=null && regex.test(config.url)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
  }
);

export default apiClient;
