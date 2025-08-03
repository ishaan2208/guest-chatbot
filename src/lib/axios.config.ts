import axios from "axios";

const instance = axios.create({
  //   baseURL: "https://api.staysystems.in/api/v1",
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default instance;
