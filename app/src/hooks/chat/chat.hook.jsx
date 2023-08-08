import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { useUsersApi } from "../../api/api";
import defaultImgAccount from "../../assets/account/default.png";
import "./chat.style.css";
import { Conversation } from "../hooks";
import { useFriendsApi } from "../../api/api";
import { useGlobalState, useChatModal } from "../../globalState/globalState";
import { useVerifyScrollBottom } from "../../scripts/verifyScrollBottom";
import searchImage from "../../assets/chat/search.png";
import switchChatIcon from "../../assets/chat/Seta.png"
import { DOMAIN_SOCK } from "../../consts/Sock";
import { useVerifySession } from "../../api/verifySessions";

export const Chat = () => {
  const [userState, setUserState] = useState(false);
  const [chatModal, setChatModal] = useChatModal()
  const [userGlobalState] = useGlobalState();
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [useSearch, setUseSearch] = useState([]);
  const [useFriends, setUserFriends] = useState([]);
  const [useSockNotification, setUseSockNotification] = useState();
  const [useSockChat, setUseSockChat] = useState();
  const [useIsSocket, setUseIsSocket] = useState();
  const [useStomp, setUseStomp] = useState({});
  const [loadMore, setLoadMore] = useState(false);
  const [switchChat, setSwitchChat] = useState(false);

  const [userData, setUserData] = useState({
    to: {},
    search: "",
    page: 0,
    email: "",
  });


  useEffect(() => {

    if (userGlobalState) {
      setUserData({ ...userData, email: userGlobalState.email})
      setUseIsSocket(1);
    }


  }, [userGlobalState])


  const { listUser } = useUsersApi();
  const { listFriends } = useFriendsApi();
  const { verifySessionUser } = useVerifySession();
  const { verifyScrollBottom } = useVerifyScrollBottom();

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {

    const friends = document.getElementById("friends")

    const userInteration  = document.getElementById("userInteration")

    const switchButton = document.getElementById("switch-button")

    if (!switchChat) {

      friends.style.width = "100%"
      
      userInteration.style.width = "0"

      switchButton.style.transform = "rotate(0)"

    } else {

      friends.style.width = "0"
      
      userInteration.style.width = "100%"

      switchButton.style.transform = "rotate(180deg)"
    }
    

  }, [switchChat])

  useEffect(() => {
    setUserData({ ...userData, page: 0 });
    listUsersService();
  }, [userData.search]);

  useEffect(() => {
    setUseSockNotification(new SockJS(DOMAIN_SOCK));
    setUseSockChat(new SockJS(DOMAIN_SOCK));
    listFriendsService();
  }, []);

  useEffect(() => {
    listFriendsService();
  }, [chatModal]);

  useEffect(() => {
    const lastNotification =
      notificationMessage[notificationMessage.length - 1];

    if (notificationMessage.length > 0) {
      if (
        notificationMessage.filter((n) => n == lastNotification).length > 1 || userData.to.email == lastNotification) {
        notificationMessage.splice(
          notificationMessage.indexOf(lastNotification),
          1
        );
        setNotificationMessage([...notificationMessage]);
      }
    }
  }, [notificationMessage]);

  useEffect(() => {
    if (!userState) {
      verifyScrollBottom(() => {
        setLoadMore(true);
      }, "scroll-user");

      setUserData({ ...userData, to: {} });
    }
  }, [userState]);

  useEffect(() => {
    if (useIsSocket == 1) {
      setUseStomp({
        ...useStomp,
        notification: over(useSockNotification),
        chat: over(useSockChat),
      });
      setUseIsSocket(2);
    } else if (useIsSocket == 2) {
      connectNotification();
      connectChat();
    }
  }, [useIsSocket]);

  useEffect(() => {
    listUsersService();
    setLoadMore(false);
  }, [userData.page]);

  useEffect(() => {
    if (loadMore) {
      setUserData({ ...userData, page: userData.page + 1 });
    }
  }, [loadMore]);

  const handleSwitch = () => {

    setSwitchChat(!switchChat)

  }

  const connectChat = () => {
    useStomp.chat.debug = null;
    useStomp.chat.connect({}, onConnectedMessage, onError);
  };

  const connectNotification = () => {
    useStomp.notification.debug = null;
    useStomp.notification.connect({}, onConnectedNotification, onError);
  };

  const onConnectedNotification = () => {
    useStomp.notification.subscribe(
      "/private/" + userData.email + "/notification/friends",
      onMessageNotification
    );
  };

  const onConnectedMessage = () => {
    useStomp.chat.subscribe(
      "/private/" + userData.email + "/chat",
      onMessageChat
    );
  };

  const onMessageChat = (payload) => {
    let payloadData = JSON.parse(payload.body);

    setNotificationMessage((prev) => [...prev, payloadData.from]);
  };

  const onMessageNotification = () => {
    listFriendsService();
  };

  const onError = (error) => {
    console.log(error);
  };

  const listUsersService = async () => {
    try {
      const response = await listUser(userData.search, userData.page);

      if (userData.page == 0) {
        setUseSearch([...response.content]);
      } else {
        setUseSearch([...useSearch, ...response.content]);
      }
    } catch (error) {
      setUseSearch([]);
      verifySessionUser(error);
    }
  };

  const listFriendsService = async () => {
    try {
      const response = await listFriends();

      setUserFriends([...response.content]);
    } catch (error) {
      verifySessionUser(error);
    }
  };

  const returnNotificationMessage = (friendEmail) => {
    if (notificationMessage.indexOf(friendEmail) != -1) {
      return <div className="notification"></div>;
    }
  };

  const handlerRemoverNotification = (friendEmail) => {
    const indexFriend = notificationMessage.indexOf(friendEmail);

    if (indexFriend != -1) {
      notificationMessage.splice(indexFriend, 1);
      setNotificationMessage([...notificationMessage]);
    }
  };

  const returnUserInteration = () => {
    if (userState == false) {
      return (
        <div className="Chat-search">
          <div className="Chat-search-content">
            <div className="Chat-search-box">
              <img src={searchImage} className="Chat-search-box-img" />
              <input
                name="search"
                type="text"
                value={userData.search}
                className="Chat-search-input"
                onChange={handlerValue}
              />
            </div>
          </div>
          <div className="Chat-search-result" id="scroll-user">
            {useSearch.length > 0
              ? useSearch.map((user, index) => (
                  <div
                    className="Chat-search-users"
                    key={index}
                    onClick={() => {
                      setUserState(true);
                      setUserData({ ...userData, to: { ...user } });
                    }}
                  >
                    <div className="Chat-search-users-img">
                      <img
                        src={
                          user.imagemPerfil
                            ? user.imagemPerfil
                            : defaultImgAccount
                        }
                      />
                    </div>
                    <div className="Chat-search-users-content">
                      <p> {user.nome} </p>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      );
    } else {
      return (
        <Conversation to={userData.to} return={() => setUserState(false)} />
      );
    }
  };

  return (
    <div className={"Chat-section" + (chatModal ? " modal" : "")}>
      <div className="Chat-container">
        <div className="Chat-exit">
          <h2 className="Chat-title">
            <strong>Chat</strong>
          </h2>
          <button
            className="Chat-exit-button button-black button-small"
            onClick={() => setChatModal(false)}
          >
            {" "}
            X{" "}
          </button>
        </div>

        <div className="Chat-content">
          <img src={switchChatIcon} className="Chat-search-box-img-switch" id="switch-button" onClick={handleSwitch}/>
          <div className="Chat-friends" id="friends">
            <div className="Chat-friends-title">
              <h4>
                <strong> Amigos </strong>
              </h4>
            </div>
            <div className="Chat-friends-list">
              {useFriends.length > 0
                ? useFriends.map((friend, index) => (
                    <div
                      className="Chat-friends-users"
                      key={index}
                      onClick={() => {
                        setUserState(userState == true ? true : !userState);
                        handlerRemoverNotification(friend.email);
                        handleSwitch()
                        setUserData({ ...userData, to: { ...friend } });
                      }}
                    >
                      {returnNotificationMessage(friend.email)}
                      <div className="Chat-friends-img">
                        <img
                          src={
                            friend.imagemPerfil
                              ? friend.imagemPerfil
                              : defaultImgAccount
                          }
                        />
                      </div>
                      <div className="Chat-friends-content">
                        <p>
                          {" "}
                          <strong> {friend.nome} </strong>{" "}
                        </p>
                        <p> {friend.email} </p>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
          <div className="Chat-conversation" id="userInteration">{returnUserInteration()}</div>
        </div>
      </div>
    </div>
  );
};
