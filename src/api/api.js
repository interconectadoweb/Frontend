import axios from "axios";

const api = axios.create({
  baseURL: "https://tienda-online-backend-xu3j.onrender.com/api"
});

export default api;
