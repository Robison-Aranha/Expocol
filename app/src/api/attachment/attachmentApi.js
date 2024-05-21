import returnIstanceCalendar from "../istanceCalendar";


export const useAttachmentApi = () => {

  const http = returnIstanceCalendar("/anexo")

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
