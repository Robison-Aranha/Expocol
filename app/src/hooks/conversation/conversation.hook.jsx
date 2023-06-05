import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../globalState/globalState";
import "./conversation.style.css";
import { useFriendsApi, useMessageApi } from "../../api/api";
import { useReognizeScroll } from "../../scripts/scrollChat";

export const Conversation = (props) => {
  const [chat, setChat] = useState([]);
  const [userGlobalState] = useGlobalState();
  const [useRelationShip, setUseRelationShip] = useState();
  const [useSock, setUseSock] = useState();
  const [useIsSocket, setUseIsSocket] = useState();
  const [useStomp, setUseStomp] = useState({});

  const [userData, setUserData] = useState({
    username: userGlobalState.nome,
    to: props.to.nome,
    message: ""
  });

  const { sendFriendSolicitation, verifyRelationShip } = useFriendsApi();
  const { listMessages } = useMessageApi();
  const { organizeScroll } = useReognizeScroll();

  useEffect(() => {
    verifyRelationShipService();
  }, []);

  useEffect(() => {
    setUseSock(new SockJS("http://localhost:8080/ws"));

    if (useRelationShip == 0) {
      setUseIsSocket(1);
    } else if (useRelationShip == 2) {
      setUseIsSocket(3);
    }
  }, [useRelationShip]);

  useEffect(() => {
    if (useIsSocket == 1) {
      listMessagesService();
      setUseStomp({ ...useStomp, chat: over(useSock) });
      setUseIsSocket(2);
    } else if (useIsSocket == 3) {
      setUseStomp({ ...useStomp, notification: over(useSock) });
      setUseIsSocket(6);
    } else if (useIsSocket == 2) {
      connectChat()
    } else if (useIsSocket == 6) {
      connectNotification()
    }
  }, [useIsSocket]);

  useEffect(() => {
    if (useRelationShip == 0) {
      organizeScroll();
    }
  }, [chat]);

  const connectChat = () => {
    useStomp.chat.debug = null;
    useStomp.chat.connect({}, onConnectedMessage, onError);
  }

  const connectNotification = () => {
    useStomp.notification.debug = null;
    useStomp.notification.connect({}, onConnectedNotification, onError);
  }

  const listMessagesService = async () => {
    try {
      const response = await listMessages(props.to.id);

      setChat([...chat, ...response]);
    } catch (response) {
      console.log(response);
    }
  };

  const verifyRelationShipService = async () => {
    try {
      const response = await verifyRelationShip(props.to.id);

      setUseRelationShip(response);
    } catch (response) {
      console.log(response);
    }
  };

  const onConnectedMessage = () => {
    useStomp.chat.subscribe(
      "/private/" + userData.username + "/chat",
      onMessageChat
    );
  };

  const onConnectedNotification = () => {
    useStomp.notification.subscribe(
      "/private/" + userData.username + "/notification/friends",
      onMessageNotification
    );
  };

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const onMessageNotification = (payload) => {
    verifyRelationShipService();
  };

  const onMessageChat = (payload) => {
    let payloadData = JSON.parse(payload.body);

    setChat((prev) => [...prev, payloadData]);
  };

  const sendMessageChat = () => {
    let chatMessage = {
      from: userGlobalState.id,
      to: userData.to,
      message: userData.message,
    };

    setChat([...chat, chatMessage]);
    setUserData({ ...userData, message: "" });

    useStomp.chat.send("/app/private", {}, JSON.stringify(chatMessage));
  };

  const sendSolicitation = async () => {
    try {
      await sendFriendSolicitation(props.to.id);

      verifyRelationShipService();
    } catch (response) {
      console.log(response);
    }
  };

  const onError = (error) => {
    console.log(error);
  };

  const returnNotification = () => {
    if (useRelationShip == 1) {
      return (
        <dev className="Chat-friend-notification">
          <p> Você e o usuario não são amigos ainda!! </p>
          <button onClick={sendSolicitation}> mandar solicitação</button>
        </dev>
      );
    } else if (useRelationShip == 2) {
      return (
        <dev className="Chat-friend-notification">
          <p> Uma solicitação de amizade foi enviada a esse usuario!! </p>
        </dev>
      );
    }
  };

  const returnChat = () => {
    if (useRelationShip == 0) {
      return (
        <dev className="Chat-conversation-section">
          <dev className="Chat-conversation-content" id="scroll">
            {chat.length > 0
              ? chat.map((menssage, index) => (
                  <dev
                    className="Chat-conversation-content-message"
                    key={index}
                    style={{
                      justifyContent:
                        menssage.to == userData.username
                          ? "flex-start"
                          : "flex-end",
                    }}
                  >
                    <p> {menssage.message} </p>
                  </dev>
                ))
              : null}
          </dev>
          <dev className="Chat-conversation-send">
            <input
              className="Chat-conversation-send-input"
              name="message"
              value={userData.message}
              onChange={handlerValue}
            />
            <button
              className="Chat-conversation-send-button"
              name="button"
              onClick={sendMessageChat}
            >
              {" "}
              send{" "}
            </button>
          </dev>
        </dev>
      );
    } else {
      return returnNotification();
    }
  };

  return returnChat();
};
