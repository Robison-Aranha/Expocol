import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/amigos",
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

  const listFriendSolicitations = async () => {
    const response = await http.get("/solicitacoes");

    return response.data;
  };

  const listFriends = async () => {
    const response = await http.get();

    return response.data;
  };

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
    verifyRelationShip,
  };
};
