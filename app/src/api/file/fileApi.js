import returnIstanceCalendar from "../istanceCalendar";


export const useIndexApi = () => {


  const http = returnIstanceCalendar("/index")

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
