import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState, useMemo } from "react";
import { useUsersApi } from "../../api/api";
import defaultImgAccount from "../../assets/account/default.png";
import "./chat.style.css";
import { Conversation } from "../hooks";
import { useFriendsApi } from "../../api/api";
import { useGlobalState } from "../../globalState/globalState";

export const Chat = (props) => {
  const [userState, setUserState] = useState(false);
  const [userGlobalState] = useGlobalState();
  const [useSearch, setUseSearch] = useState([]);
  const [useFriends, setUserFriends] = useState([]);
  const [useSock, setUseSock] = useState();
  const [useIsSocket, setUseIsSocket] = useState();
  const [useStomp, setUseStomp] = useState({});

  const [userData, setUserData] = useState({
    to: "",
    search: "",
    page: 0,
    username: userGlobalState.nome,
  });

  const { listUser } = useUsersApi();
  const { listFriends } = useFriendsApi();

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    listUsersService();
  }, [useMemo(() => userData.search)]);

  useEffect(() => {
    setUseSock(new SockJS("http://localhost:8080/ws"));
    setUseIsSocket(1);
    listFriendsService();
  }, []);

  useEffect(() => {
    if (useIsSocket == 1) {
      setUseStomp({ ...useStomp, notification: over(useSock) });
      setUseIsSocket(2);
    } else if (useIsSocket == 2) {
      connectNotification();
    }
  }, [useIsSocket]);

  const connectNotification = () => {
    useStomp.notification.debug = null;
    useStomp.notification.connect({}, onConnectedNotification, onError);
  };

  const onConnectedNotification = () => {
    useStomp.notification.subscribe(
      "/private/" + userData.username + "/notification/friends",
      onMessageNotification
    );
  };

  const onMessageNotification = (payload) => {
    listFriendsService();
  };

  const onError = (error) => {
    console.log(error);
  };

  const listUsersService = async () => {
    try {
      const response = await listUser(userData.search, userData.page);

      setUseSearch([...response.content]);
    } catch (response) {
      console.log(response);
    }
  };

  const listFriendsService = async () => {
    try {
      const response = await listFriends();

      setUserFriends([...response.content]);
    } catch (response) {
      console.log(response);
    }
  };

  const returnUserInteration = () => {
    if (userState == false) {
      return (
        <div className="Chat-search">
          <dev className="Chat-search-box">
            <input
              name="search"
              value={userData.search}
              className="Chat-search-input"
              onChange={handlerValue}
            />
            <select className="Chat-search-tag"></select>
            <select className="Chat-search-tag2"></select>
          </dev>
          <dev className="Chat-search-result">
            {useSearch.length > 0
              ? useSearch.map((user, index) => (
                  <dev
                    className="Chat-search-users"
                    key={index}
                    onClick={() => {
                      setUserState(true);
                      setUserData({ ...userData, to: user });
                    }}
                  >
                    <img
                      src={
                        user.imagemPerfil
                          ? user.imagemPerfil
                          : defaultImgAccount
                      }
                      className="Chat-search-users-img"
                    />
                    <dev className="Chat-search-users-content">
                      <p> {user.nome} </p>
                      <p> {user.email} </p>
                    </dev>
                  </dev>
                ))
              : null}
          </dev>
        </div>
      );
    } else {
      return <Conversation to={userData.to} />;
    }
  };

  return (
    <div className={"Chat-section" + (props.modal == false ? "" : " modal")}>
      <div className="Chat-container">
        <div className="Chat-exit">
          <p className="Chat-exit-button" onClick={props.setModal}>
            {" "}
            X{" "}
          </p>
        </div>

        <div className="Chat-content">
          <div className="Chat-friends">
            {useFriends.length > 0
              ? useFriends.map((friend, index) => (
                  <div
                    className="Chat-friends-users"
                    key={index}
                    onClick={() => {
                      setUserState(!userState);
                      setUserData({ ...userData, to: friend });
                    }}
                  >
                    <img
                      className="Chat-friends-img"
                      src={
                        friend.imagemPerfil
                          ? friend.imagemPerfil
                          : defaultImgAccount
                      }
                    />
                    <div className="Chat-friends-content">
                      <p> {friend.nome} </p>
                      <p> {friend.email} </p>
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="Chat-conversation">{returnUserInteration()}</div>
        </div>
      </div>
    </div>
  );
};
