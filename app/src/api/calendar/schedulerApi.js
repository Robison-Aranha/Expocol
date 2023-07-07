import axios from "axios";
import { useGlobalState } from "../../globalState/globalState";
import { useEffect, useState } from "react";

const http = axios.create({
  baseURL: "http://localhost:8001/email"
});

export const useSchedulerApi = () => {

  const [userGlobalState, ] = useGlobalState()
  const [token, setToken] = useState()


  useEffect(() => {

    setToken(userGlobalState.schedulerKey)

  }, [userGlobalState.schedulerKey])


  const sendEmail = async (to, description, dataEvent, zoneId) => {

    const response = await http.post("",{
      to: to,
      description: description,
      date: dataEvent,
      zoneId: zoneId,
    },  { headers: { Authorization: "Bearer " + token } });

    return response.data;
  };

  return { sendEmail };
};
