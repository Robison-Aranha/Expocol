import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/calendario",
  withCredentials: true,
});

export const useCalendarApi = () => {
  const returnMonth = async (year, month) => {
    const response = await http.get("/" + year + "?mes=" + month);

    return response.data;
  };

  const createCalendar = async (year) => {
    const response = await http.post("/" + year);

    return response.data;
  };

  const addIndex = async (year, month, day, file) => {
    const response = await http.put(
      "/index/" + year + "?mes=" + month + "&dia=" + day, file, {headers : {"Content-Type": "multipart/form-data"}});

    return response.data;
  };

  const returnIndexes = async (year, month, day) => {
    const response = await http.get(
      "/index/" + year + "?mes=" + month + "&dia=" + day
    );

    return response.data;
  };

  return { returnMonth, createCalendar, addIndex, returnIndexes };
};
