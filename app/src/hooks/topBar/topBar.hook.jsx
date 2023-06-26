import "./topBar.style.css";
import MensageImg from "../../assets/TopBar/02-6.png";
import FriendsImg from "../../assets/solicitations/friends.png";
import defaultImgAccount from "../../assets/account/default.png"
import { useEffect, useState } from "react";
import { Chat, Solicitations } from "../hooks";
import { useUsersApi } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useGlobalModal, useGlobalState, useGoogleCredentials } from "../../globalState/globalState";
import { clientId } from "../../api/consts/googleAccountSecrets";
import jwt_decode from "jwt-decode"

export const ToPBar = () => {
  const [modalChat, setModalChat] = useState(false);
  const [modalFriends, setModalFriends] = useState(false);
  const { detailUser } = useUsersApi();
  const [userGlobalState, setUserGlobalState] = useGlobalState();
  const [isUserLoaded, setIsUserLoaded] = useState(false)
  const [modalGlobal, setModalGlobal] = useGlobalModal()
  const [googleCredentials, setGoogleCredentials] = useGoogleCredentials()

  const navigate = useNavigate();


  useEffect(() => {

    if (isUserLoaded) {

      /* global google */
      google.accounts.id.initialize({
        client_id : clientId,
        callback: handleCallBackResponse
      })

      google.accounts.id.renderButton(
        document.getElementById("google-button"),
        { theme: "outline", size: "large"}
      )
    }

  }, [isUserLoaded])

  useEffect(() => {
    detailProfile();
  }, []);

  const handleCallBackResponse = (response) => {
    console.log(response)
    const decodeCredentials = jwt_decode(response.credential);
    setGoogleCredentials(decodeCredentials)
  }

  const detailProfile = async () => {
    try {
      const response = await detailUser();

      console.log(userGlobalState)

      setUserGlobalState({
        ...userGlobalState,
        nome: response.nome,
        gmail: response.email,
        imagem: response.imagemPerfil,
      });
      setIsUserLoaded(true)
    } catch (response) {
      setModalGlobal([...modalGlobal, { message: "Sua sessão expirou!"}])
      setTimeout(() => navigate("/"), 1000);
    }
  };

  const returnTopBar = () => {

    if (isUserLoaded) {
      return (
        <section className="TopBar-section">
          <div className="TopBar-perfil">
            <div className="TopBar-perfil-img">
              <img src={useGlobalModal.imagemPerfil ? userGlobalState.imagemPerfil : defaultImgAccount}/>
            </div>
            <div className="TopBar-perfil-credentials">
              <p> {userGlobalState?.nome} </p>
              <p> {userGlobalState?.gmail} </p>
            </div>
          </div>
          <div className="TopBar-tools">
            <div id="google-button"></div>
          </div>
          <div className="TopBar-user-intereration">
            <img
              className="TopBar-icons"
              src={MensageImg}
              alt="icone de mensagem"
              onClick={() => setModalChat(!modalChat)}
            />
            <Chat modal={modalChat} setModal={() => setModalChat(!modalChat)} />
            <img
              className="TopBar-icons"
              src={FriendsImg}
              alt="icone de amigos"
              onClick={() => setModalFriends(!modalFriends)}
            />
            <Solicitations
              modal={modalFriends}
              setModal={() => setModalFriends(!modalFriends)}
              user={userGlobalState}
            />
          </div>
        </section>
      );
    }
  }

  return returnTopBar()
};
