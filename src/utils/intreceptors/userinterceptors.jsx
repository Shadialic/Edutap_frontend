import axios from "axios";
const instance = axios.create({
  baseURL: "https://edutap.malefashion.fun"
  // baseURL: "http://localhost:3000"

});

let token = localStorage.getItem("token");
instance.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
instance.defaults.headers.post["Content-Type"] = "application/json";

instance.interceptors.request.use(
  (request) => {
    console.log("Request interceptor - Start:", request);
    return request;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default instance;
