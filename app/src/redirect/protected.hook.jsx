import { useGlobalState } from "../globalState/globalState";
import { Route, Routes } from "react-router-dom";
import { Home } from "../page/home/home.hook";
import { Navigate } from "react-router-dom";

export const Protected = () => {
  const [userGlobalState,] = useGlobalState();

  return userGlobalState.loged ? (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="*" element={"Página não encontrada"} />
    </Routes>
  ) : (
    <Navigate to="/" />
  );
};
