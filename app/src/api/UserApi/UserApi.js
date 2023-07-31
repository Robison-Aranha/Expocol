import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/usuario",
  withCredentials: true,
});

const FINAL_SIZE = 8;

export const useUsersApi = () => {
  const listUser = async (nome, page) => {
    const response = await http.get(
      "/search?nome=" + nome + "&page=" + page + "&size=" + FINAL_SIZE
    );

    return response.data;
  };

  const detailUser = async () => {
    
    const response = await http.get();


    return response.data;
  };

  const updateImageUser = async (file) => {
    const response = await http.post("/imagemPerfil", file, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  };


  const updateCredentialsUser = async (nome, email) => {

    const response = await http.post("/credenciais", { nome: nome, email: email })

    return response.data
  }

  return { listUser, detailUser, updateImageUser,  updateCredentialsUser};
};
