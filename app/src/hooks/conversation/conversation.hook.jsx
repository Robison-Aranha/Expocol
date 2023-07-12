import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { useGlobalModal, useGlobalState } from "../../globalState/globalState";
import "./conversation.style.css";
import { useFriendsApi, useMessageApi } from "../../api/api";
import { useReognizeScroll } from "../../scripts/scrollChat";
import { useVerifyScrollTop } from "../../scripts/verifyScrollTop";
import { useSetScrollDown } from "../../scripts/setScrollDown";

export const Conversation = (props) => {
  const [chat, setChat] = useState([]);
  const [userGlobalState] = useGlobalState();
  const [useRelationShip, setUseRelationShip] = useState();
  const [useSock, setUseSock] = useState();
  const [useIsSocket, setUseIsSocket] = useState();
  const [useStomp, setUseStomp] = useState({});
  const [loadMore, setLoadMore] = useState(false);
  const [first, setFirst] = useState(true);

  const [userData, setUserData] = useState({
    username: userGlobalState.nome,
    to: props.to.nome,
    message: "",
  });

  const { sendFriendSolicitation, verifyRelationShip } = useFriendsApi();
  const { listMessages } = useMessageApi();
  const { organizeScroll } = useReognizeScroll();
  const { verifyScrollTop } = useVerifyScrollTop();
  const { setScrollDown } = useSetScrollDown();
  const [, setGlobalModal] = useGlobalModal();

  useEffect(() => {
    verifyRelationShipService();
  }, []);

  useEffect(() => {
    setUseSock(new SockJS("http://localhost:8080/ws"));

    if (useRelationShip == 0) {
      verifyScrollTop(() => setLoadMore(true), "scroll-chat");
      setUseIsSocket(1);
    } else if (useRelationShip == 2) {
      setUseIsSocket(3);
    }
  }, [useRelationShip]);

  useEffect(() => {
    if (useIsSocket == 1) {
      listMessagesService(null);
      setUseStomp({ ...useStomp, chat: over(useSock) });
      setUseIsSocket(2);
    } else if (useIsSocket == 3) {
      setUseStomp({ ...useStomp, notification: over(useSock) });
      setUseIsSocket(6);
    } else if (useIsSocket == 2) {
      connectChat();
    } else if (useIsSocket == 6) {
      connectNotification();
    }
  }, [useIsSocket]);

  useEffect(() => {
    if (useRelationShip == 0) {
      organizeScroll("scroll-chat");
      if (first) {
        setScrollDown("scroll-chat");
        setFirst(false);
      }
    }
  }, [chat]);

  useEffect(() => {
    if (loadMore) {
      listMessagesService(chat[0].index);
      setLoadMore(false);
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

  const listMessagesService = async (index) => {
    try {
      const response = await listMessages(props.to.id, index);

      setChat([...response.reverse(), ...chat]);
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

    let payloadData = JSON.parse(payload.body);

    setGlobalModal((prev) => [
      ...prev,
      { message: payloadData.notification, color: "green" },
    ]);
  };

  const onMessageChat = (payload) => {
    let payloadData = JSON.parse(payload.body);

    setChat((prev) => [...prev, payloadData]);
  };

  const sendMessageChat = () => {
    let chatMessage = {
      index: chat.length + 1,
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
    if (useRelationShip == 1 || useRelationShip == 2) {
      return (
        <>
          {useRelationShip == 1 ? (
            <div className="Chat-friend-notification">
              <p> Você e o usuario não são amigos ainda!! </p>
              <button onClick={sendSolicitation}> mandar solicitação</button>
            </div>
          ) : (
            <div className="Chat-friend-notification">
              <p> Uma solicitação de amizade foi enviada a esse usuario!! </p>
            </div>
          )}
          <div className="Chat-friend-exit">
            <button className="button-clear" onClick={props.return}>voltar...</button>
          </div>
        </>
      );
    }
  };

  const returnChat = () => {
    if (useRelationShip == 0) {
      return (
        <div className="Chat-conversation-section">
          <div className="Chat-conversation-exit">
            <button className="button-small button-outline" onClick={props.return}>
              voltar
            </button>
            <p> <strong> {props.to.nome} </strong></p>
          </div>
          <div className="Chat-conversation-content" id="scroll-chat">
            {chat.length > 0
              ? chat.map((menssage, index) => (
                  <div
                    className="Chat-conversation-content-messages"
                    key={index}
                    style={{
                      justifyContent:
                        menssage.to == userData.username
                          ? "flex-start"
                          : "flex-end",
                    }}
                  >
                    <div className="Chat-conversation-message" >
                      <p> {menssage.message} </p>
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="Chat-conversation-send">
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
          </div>
        </div>
      );
    } else {
      return returnNotification();
    }
  };

  return returnChat();
};
