import returnIstanceCalendar from "../istanceCalendar";

const LANGUAGE = "por";

export const useToolsApi = () => {


  const http = returnIstanceCalendar("/ferramentas")

  const analiseImageText = async (file) => {
    const response = await http.post("/analiseDeTexto/" + LANGUAGE, file, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  };

  return { analiseImageText };
};
