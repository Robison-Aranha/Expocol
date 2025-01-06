import { Route, Routes } from "react-router-dom";
import { LoginRegister } from "./page/login-register/login-register.hook";
import { Protected } from "./redirect/protected.hook";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginRegister />} />

      <Route path="*" element={<Protected />} />
    </Routes>
  );
}

export default App;
