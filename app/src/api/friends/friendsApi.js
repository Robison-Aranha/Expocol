import axios from "axios";
import { BaseUrl } from "../BaseUrl";

const http = axios.create({
  baseURL: BaseUrl + "/amigos",
  withCredentials: true,
});

export const useFriendsApi = () => {
  const sendFriendSolicitation = async (id) => {
    const response = await http.put("/enviar/" + id);

    return response.data;
  };

  const acceptFriendSolicitation = async (id) => {
    const response = await http.put("/aceitar/" + id);

    return response.data;
  };

  const ignoreFriendSolicitation = async (id) => {
    const response = await http.put("/ignorar/" + id);

    return response.data;
  };

  const undoFriendship = async (id) => {

    const response = await http.put("/desfazer/" + id);


    return response.data

  }

  const blockFriendship = async (id) => {

    const response = await http.put("/bloquear/" + id)

    return response.data
  }

  const unblockFriendship = async (id) => {

    const response = await http.put("/desbloquear/" + id)

    return response.data
  }

  const listFriendSolicitations = async () => {
    const response = await http.get("/solicitacoes");

    return response.data;
  };

  const listFriends = async () => {
    const response = await http.get();

    return response.data;
  }

  const verifyRelationShip = async (id) => {
    const response = await http.get("/verificar/" + id);

    return response.data;
  };

  return {
    sendFriendSolicitation,
    acceptFriendSolicitation,
    ignoreFriendSolicitation,
    listFriendSolicitations,
    listFriends,
    undoFriendship,
    blockFriendship,
    unblockFriendship,
    verifyRelationShip,
  };
};
