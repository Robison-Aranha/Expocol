import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export const useLoginRegister = () => {
  const register = async (gmail, username, password) => {
    const response = await http.post("/register", {
      email: gmail,
      nome: username,
      senha: password,
    });

    return response.data;
  };

  const login = async (gmail, password) => {

    const authorization = btoa(gmail + ":" + password);

    const response = await http.post(
    "/login",
    {},
    { headers: { Authorization: "Basic " + authorization } }
    );
    return response.data;
  };

  const refreshToken = async () => {

    const response = await http.get("/refresh")

    return response.data
  }

  return {login, register, refreshToken};
};
