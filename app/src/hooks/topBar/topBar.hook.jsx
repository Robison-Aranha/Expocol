import "./topBar.style.css";
import MensageImg from "../../assets/TopBar/02-6.png";
import FriendsImg from "../../assets/solicitations/friends.png";
import ClassroomIcon from "../../assets/tools/classroom.png"
import defaultImgAccount from "../../assets/account/default.png"
import { useEffect, useState } from "react";
import { Chat, Solicitations } from "../hooks";
import { useUsersApi } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useGlobalModal, useGlobalState, useGoogleCredentials, useClassroomToken } from "../../globalState/globalState";
import { clientId } from "../../consts/googleAccountSecrets";
import { scopes } from "../../consts/scopes";
import jwt_decode from "jwt-decode"


export const ToPBar = () => {
  const [modalChat, setModalChat] = useState(false);
  const [modalFriends, setModalFriends] = useState(false);
  const { detailUser } = useUsersApi();
  const [userGlobalState, setUserGlobalState] = useGlobalState();
  const [isUserLoaded, setIsUserLoaded] = useState(false)
  const [globalModal, setGlobalModal] = useGlobalModal()
  const [googleCredentials, setGoogleCredentials] = useGoogleCredentials()
  const [classroomToken, setClassroomToken] = useClassroomToken()
  const [tokenClient, setTokenClient] = useState({})

  const navigate = useNavigate();


  useEffect(() => {

    if (isUserLoaded) {

      handleGoogleEvents()
      
    }
    
  }, [isUserLoaded])

  useEffect(() => {

    if (!googleCredentials && isUserLoaded) {
      handleGoogleEvents()
    }

  }, [googleCredentials])

  useEffect(() => {
    detailProfile();
  }, []);

  const handleGoogleEvents = () => {

    const google = window.google

    google.accounts.id.initialize({
      client_id : clientId,
      callback: handleCallBackResponse
    })

    google.accounts.id.renderButton(
      document.getElementById("google-button"),
      { theme: "filled_black", type: "icon", shape: "circle"}
    )

    setTokenClient(google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope : scopes,
      callback: (tokenResponse) => {
        console.log(tokenResponse.access_token)
        if (tokenResponse.access_token) {
          setClassroomToken(tokenResponse.access_token)
          setGlobalModal([...globalModal, { message: "Login com classroom concluido!!" }])
        }
      }
    }))


    google.accounts.id.prompt()
  }

  const handleGetClassroomToken = () => {
    tokenClient.requestAccessToken()
  }

  const handleLogOutClassroom = () => {
    setClassroomToken(null)
    setGlobalModal([...globalModal, { message: "Log out com classroom concluido!" }])
  }

  const handleCallBackResponse = (response) => {
    setGlobalModal([...globalModal, {message: "Login com o google concluido! Serviços adicionais liberados!"}])
    const decodeCredentials = jwt_decode(response.credential);
    console.log(decodeCredentials)
    setGoogleCredentials(decodeCredentials)
  }

  const detailProfile = async () => {
    try {
      const response = await detailUser()

      setUserGlobalState({
        ...userGlobalState,
        nome: response.nome,
        gmail: response.email,
        imagem: response.imagemPerfil,
      });
      setIsUserLoaded(true)
    } catch (response) {
      localStorage.removeItem("user")
      setGlobalModal([...globalModal, { message: "Sua sessão expirou!"}])
      setTimeout(() => navigate("/"), 1000);
    }
  };

  const handleLogOutGoogle = () => {

    setGoogleCredentials(null)
    setGlobalModal([...globalModal, { message: "Log out concluido! "} ])
  }

  const returnGoogleTools = () => {

    if (googleCredentials) {
      
      return (
        
        <img className="TopBar-classroom" style={{ opacity: (classroomToken ? 0.3 : 1) }} onClick={ classroomToken ? handleLogOutClassroom : handleGetClassroomToken} src={ClassroomIcon} />
      
      )

    }

  }

  const returnTopBar = () => {

    if (isUserLoaded) {
      return (
        <section className="TopBar-section">
          <div className="TopBar-perfil">
            <div className="TopBar-user-info">
              <div className="TopBar-perfil-img">
                <img src={useGlobalModal.imagemPerfil ? userGlobalState.imagemPerfil : defaultImgAccount}/>
              </div>
              <div className="TopBar-perfil-credentials">
                <p> {userGlobalState?.nome} </p>
                <p> {userGlobalState?.gmail} </p>
              </div>
            </div>
            <div className="TopBar-google-auth"> 
              { googleCredentials ? <img src={googleCredentials.picture} onClick={handleLogOutGoogle} /> : <div id="google-button"></div> }
              <p><strong> {googleCredentials ? "Logout" : "Logue-se"} </strong></p>
            </div>
          </div>
          <div className="TopBar-tools">
            {returnGoogleTools()}
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
