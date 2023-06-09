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
      "/index/" + year + "?mes=" + month + "&dia=" + day,
      file,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  };

  const addEvent = async (
    title,
    description,
    time,
    dataEvent,
    schedulerName,
    schedulerGroup,
    year,
    month,
    day
  ) => {
    const response = await http.post(
      "/evento/" + year + "?mes=" + month + "&dia=" + day,
      {
        titulo: title,
        descricao: description,
        tempo: time,
        dataNotificacao: dataEvent,
        schedulerName: schedulerName,
        schedulerGroup: schedulerGroup,
      }
    );

    return response.data;
  };

  const returnEvent = async (id) => {
    const response = await http.get("/evento/" + id);

    return response.data;
  };

  const returnIndexesEvents = async (year, month, day) => {
    const response = await http.get(
      "/index/" + year + "?mes=" + month + "&dia=" + day
    );

    return response.data;
  };

  return {
    returnMonth,
    createCalendar,
    addIndex,
    returnIndexesEvents,
    addEvent,
    returnEvent,
  };
};
