import axios from "axios";
import { BaseUrl } from "../BaseUrl";

const http = axios.create({
  baseURL: BaseUrl + "/index",
  withCredentials: true,
});


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
