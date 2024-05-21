import returnIstanceEmail from "../istanceEmail";

export const useSchedulerApi = () => {

  const http = returnIstanceEmail("/email")

  const sendEmail = async (to, description, dataEvent, zoneId) => {

    const data = {
      to: to,
      description: description,
      date: dataEvent,
      zoneId: zoneId,
    }

    const response = await http.post("", data);

    return response.data;
  };

  return { sendEmail };
};
