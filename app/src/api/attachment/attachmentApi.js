import axios from "axios";
import { BaseUrl } from "../BaseUrl";

const http = axios.create({
  baseURL: BaseUrl + "/anexo",
  withCredentials: true,
});

export const useAttachmentApi = () => {
  const addAttachment = async (file) => {
    const response = await http.post("", file, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  };

  const returnAttachment = async (id) => {
    const response = await http.get("/" + id);

    return response.data;
  };

  return { addAttachment, returnAttachment };
};
