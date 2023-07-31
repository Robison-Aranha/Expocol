import { useEffect, useState } from "react";
import { useLoginRegister } from "../../api/api";
import "./login-register.style.css";
import { useNavigate } from "react-router-dom";
import { useGlobalState, useGlobalModal, useGlobalLoading } from "../../globalState/globalState";
import { Notification } from "../../hooks/notification/notification.hook";
import { useLocation } from "react-router-dom";

export const LoginRegister = () => {
  const [userGlobalState, setUserGlobalState] = useGlobalState();
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [, setLoading] = useGlobalLoading()

  const [userData, setUserData] = useState({
    gmail: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const navigate = useNavigate();
  const location = useLocation()
  const { login, register } = useLoginRegister();

  const [userState, setUserState] = useState(false);

  useEffect(() => {

    if (location.state == "expired") {
      setGlobalModal([...globalModal, { message: "Sua sessão expirou!!" }])
    }
  }, [])

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const verifyCredentials = () => {
    if (userState) {
      if (userData.username == "" || userData.username == null) {
        return false;
      } else if (
        userData.passwordConfirm != "" &&
        userData.passwordConfirm != null
      ) {
        if (userData.password != userData.passwordConfirm) {
          return 2;
        }
      } else {
        return false;
      }
    }

    if (userData.gmail == "" || userData.gmail == null) {
      return false;
    } else if (userData.password == "" || userData.password == null) {
      return false;
    }

    return true;
  };

  const handleCommit = () => {
    const value = verifyCredentials();
    
    if (value) {
      if (value == 2) {
        setGlobalModal([...globalModal, { message: "Senhas não são iguais!" }]);
      } else {
        if (userState == false) {
          loginService();
        } else {
          registerService();
        }
      }
    } else {
      setGlobalModal([...globalModal, { message: "Credenciais Invalidas!" }]);
    }
  };

  const handleChangeState = () => {
    setUserState(!userState);

    setUserData({
      gmail: "",
      username: "",
      password: "",
      passwordConfirm: "",
    });
  };

  const loginService = async () => {
    setLoading(true)
    try {
      const response = await login(userData.gmail, userData.password);

      const userInfo = {
        ...userGlobalState,
        loged: true,
        id: response.id,
        schedulerKey: response.token,
      };

      setUserGlobalState({ ...userInfo });

      localStorage.setItem("user", JSON.stringify({ ...userInfo }));

      navigate("/home");
    } catch (response) {
      setGlobalModal([...globalModal, { message: "Login falhou!" }]);
    }
    setLoading(false)
  };

  const registerService = async () => {
    setLoading(true)
    try {
      await register(userData.gmail, userData.username, userData.password);

      setUserState(false);
      setGlobalModal([
        ...globalModal,
        { message: "Conta criada com sucesso!" },
      ]);
    } catch (error) {
      if (error.response.data.fields) {
        const decodedErros = JSON.parse(error.response.data.fields);

        decodedErros.forEach((error) => globalModal.push({ message: error }));
      } else {
        if (error.response.data.status == 409) {
          globalModal.push({ message: error.response.data.message });
        }
      }

      setGlobalModal([...globalModal]);

      console.log(error);
    }

    setLoading(false)
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
                <blockquote>
                  {" "}
                  O nome de usuário deve ter de 6 a 12 de comprimento sem
                  caracteres especiais!{" "}
                </blockquote>
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
                <blockquote>
                  {" "}
                  A senha deve ter no mínimo 4 e no máximo 12 de comprimento
                  contendo pelo menos 1 maiúscula, 1 minúscula, 1 caractere
                  especial e 1 dígito!{" "}
                </blockquote>
              </>
            ) : null}
          </div>
          <div className="LoginRegister-switch">
            <a onClick={handleChangeState}>
              {" "}
              {userState == false
                ? "Não possui uma Conta ainda?"
                : "Ja possui uma conta?"}{" "}
              {userState == false ? "Registrar" : "Logar"}{" "}
            </a>
            <button onClick={handleCommit}>
              {" "}
              {userState == false ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
