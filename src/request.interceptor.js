import config from "../config";
import axios from "axios";

const apiClient = axios.create({
  baseURL: config["dxConfig"]["dxCatUrl"],
  headers: {
    "Content-Type": "application/json",
  },
});


// Add request interceptor
apiClient.interceptors.request.use(

  (config) => {
    const token = sessionStorage.getItem('dxAAAToken');
    const regex = /collections\/[a-f0-9-]+\/items\/[a-f0-9-]+/i;
    if (token !=null && token !='undefined' && regex.test(config.url)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }else{
      // KC token is being added as the Authorization token, if we are not sending the dx token. Hence we are removing it from the header explicitly 
      config.headers.delete("Authorization");
    }
    return config;
  },
  (error) => {
    console.log(error);
  }
);

export default apiClient;
