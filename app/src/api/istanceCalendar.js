import axios from "axios";
import { BaseUrlCalendar } from "./baseUrlCalendar";

const returnIstanceCalendar = (endpoint) => {
  const http = axios.create({
    baseURL: BaseUrlCalendar,
  });

  const storage = localStorage.getItem("user");

  const token = storage ? JSON.parse(storage).token : "";

  http.defaults.baseURL += endpoint ? endpoint : "";
  http.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return http;
};

export default returnIstanceCalendar;
