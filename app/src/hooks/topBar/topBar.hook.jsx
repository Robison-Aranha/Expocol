import "./topBar.style.css";
import MensageImg from "../../assets/TopBar/02-6.png";
import FriendsImg from "../../assets/friends/friends.png";
import { useEffect, useState } from "react";
import { Chat, Solicitations } from "../hooks";
import { useUsersApi } from "../../api/api";
import { useGlobalState } from "../../globalState/globalState";
import { useNavigate } from "react-router-dom";

export const ToPBar = () => {
  const [modalChat, setModalChat] = useState(false);

  const [modalFriends, setModalFriends] = useState(false);

  const { detailUser } = useUsersApi();

  const [userGlobalState, setUserGlobalState] = useGlobalState();
  const [isUserLoaded, setIsUserLoaded] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    detailProfile();
  }, []);

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
      navigate("/");
    }
  };

  const returnTopBar = () => {

    if (isUserLoaded) {
      return (
        <section className="TopBar-section">
          <div className="TopBar-perfil"></div>
          <div>
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
          Top Bar
        </section>
      );
    }
  }

  return returnTopBar()
};
