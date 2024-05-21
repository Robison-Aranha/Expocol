import returnIstanceCalendar from "../istanceCalendar";


export const useMessageApi = () => {

  const http = returnIstanceCalendar("/mensagens")

  const listMessages = async (id, index) => {
    const response = await http.get(
      "/" + id + "?index=" + (index ? index : "")
    );

    return response.data;
  };

  return { listMessages };
};
