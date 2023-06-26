import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/mensagens",
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
