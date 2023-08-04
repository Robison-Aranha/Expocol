import axios from "axios";
import { BaseUrl } from "../BaseUrl";

const http = axios.create({
  baseURL: BaseUrl + "/mensagens",
  withCredentials: true,
});

export const useMessageApi = () => {
  const listMessages = async (id, index) => {
    const response = await http.get(
      "/" + id + "?index=" + (index ? index : "")
    );

    return response.data;
  };

  return { listMessages };
};
