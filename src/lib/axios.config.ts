import axios from "axios";

const apiBaseUrl = "https://api.staysystems.in/api/v1";

const instance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default instance;
