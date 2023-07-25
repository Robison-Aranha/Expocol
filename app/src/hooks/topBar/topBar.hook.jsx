import "./topBar.style.css";
import MensageImg from "../../assets/TopBar/02-6.png";
import FriendsImg from "../../assets/solicitations/friends.png";
import ClassroomIcon from "../../assets/tools/classroom.png";
import defaultImgAccount from "../../assets/account/default.png";
import { useEffect, useState } from "react";
import { Chat, Solicitations } from "../hooks";
import { useUsersApi } from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  useGlobalModal,
  useGlobalState,
  useGoogleCredentials,
  useClassroomToken,
  useGlobalChangeProfile,
  useGlobalLoading
} from "../../globalState/globalState";
import { clientId } from "../../consts/googleAccountSecrets";
import { scopes } from "../../consts/scopes";
import jwt_decode from "jwt-decode";

export const ToPBar = () => {

  const [modalChat, setModalChat] = useState(false);
  const [modalFriends, setModalFriends] = useState(false);
  const { detailUser } = useUsersApi();
  const [userGlobalState, setUserGlobalState] = useGlobalState();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [, setLoading] = useGlobalLoading()
  const [, setGlobalChangeProfile] = useGlobalChangeProfile()
  const [googleCredentials, setGoogleCredentials] = useGoogleCredentials();
  const [classroomToken, setClassroomToken] = useClassroomToken();
  const [tokenClient, setTokenClient] = useState({});

  const navigate = useNavigate();

  useEffect(() => {

    if (!googleCredentials && isUserLoaded) {
      handleGoogleEvents()
    }

  }, [googleCredentials, isUserLoaded])

  useEffect(() => {
    detailProfile()
  }, []);

  const handleGoogleEvents = () => {
    
    /* global google */

    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCallBackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("google-button"), {
      theme: "filled_black",
      type: "icon",
      shape: "pill"
    });

    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scopes,
        callback: (tokenResponse) => {
      
          if (tokenResponse.access_token) {
            setClassroomToken(tokenResponse.access_token);
            setGlobalModal([
              ...globalModal,
              { message: "Login com classroom concluido!!" },
            ]);
          }
        },
      })
    );

    google.accounts.id.prompt();

  };

  const handleGetClassroomToken = () => {
    tokenClient.requestAccessToken();
  };

  const handleLogOutClassroom = () => {
    setClassroomToken(null);
    setGlobalModal([
      ...globalModal,
      { message: "Log out com classroom concluido!" },
    ]);
  };

  const handleCallBackResponse = (response) => {
    setGlobalModal([
      ...globalModal,
      {
        message: "Login com o google concluido! Serviços adicionais liberados!",
      },
    ]);
    const decodeCredentials = jwt_decode(response.credential);
   
    setGoogleCredentials(decodeCredentials);
  };

  const detailProfile = async () => {
    setLoading(true)
    
    try {
      const response = await detailUser();

     
      setUserGlobalState({
        ...userGlobalState,
        nome: response.nome,
        email: response.email,
        imagem: response.imagemPerfil,
      });

      setIsUserLoaded(true);
    } catch (response) {
      localStorage.removeItem("user");
      setGlobalModal([...globalModal, { message: "Sua sessão expirou!" }]);
      setTimeout(() => navigate("/"), 1000);
    }
    setLoading(false)
  };

  const handleLogOutGoogle = () => {
    setGoogleCredentials(null);
    setClassroomToken(null);
  };

  const returnGoogleTools = () => {
    if (googleCredentials) {
      return (
        <img
          className="TopBar-classroom"
          style={{ opacity: classroomToken ? 0.3 : 1 }}
          onClick={
            classroomToken ? handleLogOutClassroom : handleGetClassroomToken
          }
          src={ClassroomIcon}
        />
      );
    }
  };

  const returnGoogleIcon = () => {
    if (googleCredentials && isUserLoaded) {
      return (
        <img src={googleCredentials.picture} onClick={handleLogOutGoogle}/>
      );
    } else if (!googleCredentials && isUserLoaded ) {
      return <div id="google-button"></div>;
    }
  };

  const returnTopBar = () => {
    return (
      <section className="TopBar-section">
        <div className="TopBar-perfil">
          <div className="TopBar-user-info">
            <div className="TopBar-perfil-img">
              <img
                src={
                  userGlobalState.imagem
                    ? userGlobalState.imagem
                    : defaultImgAccount
                }
                onClick={() => setGlobalChangeProfile(true)}
              />
            </div>
            <div className="TopBar-perfil-credentials">
              <p> {userGlobalState?.nome} </p>
              <p> {userGlobalState?.email} </p>
            </div>
          </div>
        </div>
          <div className="TopBar-google-auth"  onClick={handleLogOutGoogle} style={{ cursor : "pointer" }}>
            {returnGoogleIcon()}
            <p> <strong> {googleCredentials ? "Logado" : "Login"} </strong> </p>
          </div>
        <div className="TopBar-tools">{returnGoogleTools()}</div>
        { isUserLoaded ? 
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
          : null
        }
      </section>
    );
  };

  return returnTopBar();
};
