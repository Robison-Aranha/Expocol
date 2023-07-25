import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/index",
  withCredentials: true,
});

const FINAL_SIZE = 8;

export const useIndexApi = () => {
  const returnIndex = async (id) => {
    const response = await http.get("/" + id);

    return response.data;
  };

  const deleteIndex = async (id) => {
    const response = await http.delete("/" + id);

    return response.data;
  };



  return { returnIndex, deleteIndex };
};
