import returnIstanceCalendar from "../istanceCalendar";

export const useLoginRegister = () => {
  const http = returnIstanceCalendar();

  const register = async (gmail, username, password) => {
    const data = {
      email: gmail,
      nome: username,
      senha: password,
    };

    const response = await http.post("/register", data);

    return response.data;
  };

  const login = async (gmail, password) => {
    const data = {
      gmail: gmail,
      password: password,
    };

    const response = await http.post("/login", data);

    return response.data;
  };

  const refreshToken = async () => {
    const response = await http.get("/refresh");

    return response.data;
  };

  const logout = async () => {
    await http.get("/logout");
  };

  return { login, logout, register, refreshToken };
};
