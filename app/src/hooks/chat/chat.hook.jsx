import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { useUsersApi } from "../../api/api";
import defaultImgAccount from "../../assets/account/default.png";
import "./chat.style.css";
import { Conversation } from "../hooks";
import { useFriendsApi } from "../../api/api";
import { useGlobalState } from "../../globalState/globalState";
import { useVerifyScrollBottom } from "../../scripts/verifyScrollBottom";
import searchImage from "../../assets/chat/search.png";

export const Chat = (props) => {
  const [userState, setUserState] = useState(false);
  const [userGlobalState] = useGlobalState();
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [useSearch, setUseSearch] = useState([]);
  const [useFriends, setUserFriends] = useState([]);
  const [useSockNotification, setUseSockNotification] = useState();
  const [useSockChat, setUseSockChat] = useState();
  const [useIsSocket, setUseIsSocket] = useState();
  const [useStomp, setUseStomp] = useState({});
  const [loadMore, setLoadMore] = useState(false);

  const [userData, setUserData] = useState({
    to: {},
    search: "",
    page: 0,
    email: userGlobalState.email,
  });

  const { listUser } = useUsersApi();
  const { listFriends } = useFriendsApi();
  const { verifyScrollBottom } = useVerifyScrollBottom();

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    setUserData({ ...userData, page: 0 });
    listUsersService();
  }, [userData.search]);

  useEffect(() => {
    setUseSockNotification(new SockJS("http://localhost:8080/ws"));
    setUseSockChat(new SockJS("http://localhost:8080/ws"))
    setUseIsSocket(1);
    listFriendsService();
  }, []);

  useEffect(() => {
    listFriendsService();
  }, [props.modal]);

  useEffect(() => {
    
    const lastNotification = notificationMessage[notificationMessage.length - 1];

    if (notificationMessage.length > 0) {
      if (notificationMessage.filter(n => n == lastNotification).length > 1 || userData.to.email == lastNotification) {
        notificationMessage.pop(notificationMessage.indexOf(lastNotification))
        setNotificationMessage([...notificationMessage])
      }
    }

  }, [notificationMessage])

  useEffect(() => {
    if (!userState) {
      verifyScrollBottom(() => {
        setLoadMore(true);
      }, "scroll-user");

      setUserData({ ...userData, to: {}})
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
      connectChat()
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
    listFriendsService()
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
    } catch (response) {
      setUseSearch([]);
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

  const returnNotificationMessage = (friendEmail) => {
    
    if (notificationMessage.indexOf(friendEmail) != -1) {
      
     
      return (
        <div className="notification"></div>
      )
    }

  };

  const handlerRemoverNotification = (friendEmail) => {
    notificationMessage.pop(notificationMessage.indexOf(friendEmail));
    setNotificationMessage([...notificationMessage])
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
    <div className={"Chat-section" + (props.modal == false ? "" : " modal")}>
      <div className="Chat-container">
        <div className="Chat-exit">
          <h2 className="Chat-title">
            <strong>Chat</strong>
          </h2>
          <button
            className="Chat-exit-button button-black button-small"
            onClick={props.setModal}
          >
            {" "}
            X{" "}
          </button>
        </div>

        <div className="Chat-content">
          <div className="Chat-friends">
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
          <div className="Chat-conversation">{returnUserInteration()}</div>
        </div>
      </div>
    </div>
  );
};
