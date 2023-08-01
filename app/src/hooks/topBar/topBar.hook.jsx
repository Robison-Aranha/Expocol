import "./topBar.style.css";
import MensageImg from "../../assets/TopBar/02-6.png";
import FriendsImg from "../../assets/solicitations/friends.png";
import ClassroomIcon from "../../assets/tools/classroom.png";
import OcrIcon from "../../assets/tools/ocr.png";
import NewsIcon from "../../assets/tools/news.png"
import DictionaryIcon from "../../assets/tools/dictionary.png";
import defaultImgAccount from "../../assets/account/default.png";
import MenuIcon from "../../assets/marca_da_agua.png"
import { useEffect, useState } from "react";
import { Chat, Solicitations } from "../hooks";
import { useUsersApi } from "../../api/api";
import {
  useGlobalModal,
  useGlobalState,
  useGoogleCredentials,
  useClassroomToken,
  useGlobalChangeProfile,
  useGlobalLoading,
  useImageTextAnaliserModal,
  useDicionaryModal,
  useNewsPaperModal
} from "../../globalState/globalState";
import { clientId } from "../../consts/googleAccountSecrets";
import { SCOPES } from "../../consts/scopes";
import { useVerifySession } from "../../api/verifySessions";
import jwt_decode from "jwt-decode";

export const ToPBar = () => {
  const [modalChat, setModalChat] = useState(false);
  const [modalFriends, setModalFriends] = useState(false);
  const [userGlobalState, setUserGlobalState] = useGlobalState();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [, setLoading] = useGlobalLoading();
  const [, setGlobalChangeProfile] = useGlobalChangeProfile();
  const [googleCredentials, setGoogleCredentials] = useGoogleCredentials();
  const [classroomToken, setClassroomToken] = useClassroomToken();
  const [, setImageTextAnaliser] = useImageTextAnaliserModal();
  const [, setDictionaryModal] = useDicionaryModal();
  const [, setNewsPaperModal] = useNewsPaperModal()
  const [tokenClient, setTokenClient] = useState({});

  const { detailUser } = useUsersApi();
  const { verifySessionUser } = useVerifySession();

  useEffect(() => {
    if (!googleCredentials && isUserLoaded) {
      handleGoogleEvents();
    }
  }, [googleCredentials, isUserLoaded]);

  useEffect(() => {
    detailProfile();
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
      shape: "pill",
    });

    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
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
    setLoading(true);

    try {
      const response = await detailUser();

      setUserGlobalState({
        ...userGlobalState,
        nome: response.nome,
        email: response.email,
        imagem: response.imagemPerfil,
      });

      setIsUserLoaded(true);
    } catch (error) {
      verifySessionUser(error);
    }
    setLoading(false);
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
        <img src={googleCredentials.picture} onClick={handleLogOutGoogle} />
      );
    } else if (!googleCredentials && isUserLoaded) {
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
        <div
          className="TopBar-google-auth"
          onClick={handleLogOutGoogle}
          style={{ cursor: "pointer" }}
        >
          {returnGoogleIcon()}
          <p>
            {" "}
            <strong> {googleCredentials ? "Logado" : "Login"} </strong>{" "}
          </p>
        </div>
        <div className="TopBar-tools">
          {returnGoogleTools()}
          <img src={OcrIcon} onClick={() => setImageTextAnaliser(true)} />
          <img src={NewsIcon} onClick={() => setNewsPaperModal(true)} />
          <img src={DictionaryIcon} onClick={() => setDictionaryModal(true)} />
        </div>
        {isUserLoaded ? (
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
        ) : null}
      </section>
    );
  };

  return returnTopBar();
};
