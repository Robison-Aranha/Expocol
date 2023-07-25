import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/anexo",
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
