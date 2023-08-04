import axios from "axios";
import { BaseUrl } from "../BaseUrl";

const http = axios.create({
  baseURL: BaseUrl + "/ferramentas",
  withCredentials: true,
});

const LANGUAGE = "por";

export const useToolsApi = () => {
  const analiseImageText = async (file) => {
    const response = await http.post("/analiseDeTexto/" + LANGUAGE, file, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  };

  return { analiseImageText };
};
