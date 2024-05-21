import axios from "axios";
import { BaseUrlEmail } from "./baseUrlEmail";

const returnIstanceEmail = (endpoint) => {
  const http = axios.create({
    baseURL: BaseUrlEmail,
  });

  const storage = localStorage.getItem("user");

  const token = storage ? JSON.parse(storage).token : "";

  console.log(token)

  http.defaults.baseURL += endpoint ? endpoint : "";
  http.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return http;
};

export default returnIstanceEmail;
