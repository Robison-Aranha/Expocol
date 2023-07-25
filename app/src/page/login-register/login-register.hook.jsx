import { useState } from "react";
import { useLoginRegister } from "../../api/api";
import "./login-register.style.css";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../../globalState/globalState";
import { useGlobalModal } from "../../globalState/globalState";
import { Notification } from "../../hooks/notification/notification.hook";


export const LoginRegister = () => {
  const [userGlobalState, setUserGlobalState] = useGlobalState()
  const [globalModal, setGlobalModal] = useGlobalModal()

  const [userData, setUserData] = useState({
    gmail: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const navigate = useNavigate();

  const { login, register } = useLoginRegister();

  const [userState, setUserState] = useState(false);

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const verifyCredentials = () => {
    if (
      userState == true &&
      (userData.username == "" || userData.username == null)
    ) {
      return false;
    } else if (userData.password == "" || userData.password == null) {
      return false;
    } else if (
      userState == true &&
      (userData.passwordConfirm == "" || userData.passwordConfirm == null)
    ) {
      if (userData.password != userData.passwordConfirm) {
        return false;
      }
    } else if (userData.gmail == "" || userData.passwordConfirm == null) {
      return false;
    }

    return true;
  };

  const handleCommit = () => {
    if (verifyCredentials()) {
      if (userState == false) {
        loginService();
      } else {
        registerService();
      }
    } else {
      setGlobalModal([...globalModal, { message: "Credenciais Invalidas!", color: "red" }])
    }
  };

  const handleChangeState = () => {
    setUserState(!userState);

    setUserData({
      gmail: "",
      username: "",
      password: "",
      passwordConfirm: ""
    });
  };

  const loginService = async () => {
    try {
      const response = await login(userData.gmail, userData.password);

      const userInfo = { ...userGlobalState, loged: true, id: response.id, schedulerKey: response.token }

      setUserGlobalState({...userInfo});
      
      localStorage.setItem("user", JSON.stringify({...userInfo}));

      navigate("/home");
    } catch (response) {
     
      setGlobalModal([ ...globalModal, { message: "Login falhou!"}])
    }
  };

  const registerService = async () => {
    try {
      await register(
        userData.gmail,
        userData.username,
        userData.password
      );

      setUserState(false);
      setGlobalModal([...globalModal, { message: "Conta criada com sucesso!", error : false }])
    } catch (error) {
      if (error.response.status == 409) {
        setGlobalModal([...globalModal, { message: error.response.data.message }])
      }
    }
  };

  return (
    <>
      <Notification />
      <section className="LoginRegister-Section">
        <div className="LoginRegister">
          <div className="LoginRegister-Credentials">
            <input
              name="gmail"
              type="email"
              value={userData.gmail}
              onChange={handlerValue}
              placeholder="Digite seu gmail"
              autoComplete="off"
            />
            {userState == true ? (
              <>
              <input
                name="username"
                type="text"
                value={userData.username}
                onChange={handlerValue}
                placeholder="Digite seu nome de usuario"
                autoComplete="off"
              />
              <blockquote> O nome de usuário deve ter de 6 a 12 de comprimento sem caracteres especiais! </blockquote>
              </>
            ) : null}
            <input
              name="password"
              type="password"
              value={userData.password}
              onChange={handlerValue}
              placeholder="Digite sua senha"
              autoComplete="off"
            />
            {userState == true ? (
              <>
              <input
                name="passwordConfirm"
                type="password"
                value={userData.passwordConfirm}
                onChange={handlerValue}
                placeholder="Confirme Sua Senha"
                autoComplete="off"
              />
              <blockquote> A senha deve ter no mínimo 4 e no máximo 12 de comprimento contendo pelo menos 1 maiúscula, 1 minúscula, 1 caractere especial e 1 dígito! </blockquote>
              </>
            ) : null}
          </div>
          <div className="LoginRegister-switch">

            <a onClick={handleChangeState}>
              {" "}
              {userState == false
                ? "Não possui uma Conta ainda?"
                : "Ja possui uma conta?"}{" "}
              {" "}
              {userState == false ? "Registrar" : "Logar"}{" "}
            </a>
            <button  onClick={handleCommit}>
              {" "}
              {userState == false ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
