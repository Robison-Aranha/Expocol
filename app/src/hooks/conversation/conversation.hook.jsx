import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState, useMemo } from "react";
import {
  useGlobalModal,
  useGlobalState,
  useGlobalLoading,
  useAnexoModal,
} from "../../globalState/globalState";
import "./conversation.style.css";
import { useFriendsApi, useMessageApi, useAttachmentApi } from "../../api/api";
import { useReognizeScroll } from "../../scripts/scrollChat";
import { useVerifyScrollTop } from "../../scripts/verifyScrollTop";
import { useSetScrollDown } from "../../scripts/setScrollDown";
import { useVerifySession } from "../../api/verifySessions";
import defaultImgAccount from "../../assets/account/default.png";
import attachmentImage from "../../assets/chat/attachment.png";
import downloadImage from "../../assets/chat/download.png";
import { MAX_FILE } from "../../consts/FileMax";
import { DOMAIN_SOCK } from "../../consts/Sock";

export const Conversation = (props) => {
  const [chat, setChat] = useState([]);
  const [userGlobalState] = useGlobalState();
  const [useRelationShip, setUseRelationShip] = useState();
  const [useSockChat, setUseSockChat] = useState();
  const [useSockNotification, setUseSockNotification] = useState();
  const [useIsSocket, setUseIsSocket] = useState();
  const [useStomp, setUseStomp] = useState({});
  const [loadMore, setLoadMore] = useState(false);
  const [isNecessaryLoadMore, setIsNecessaryLoadMore] = useState(true);
  const [first, setFirst] = useState(true);
  const [payloadMessage, setPayloadMessage] = useState();
  const [payloadNotification, setPayloadNotification] = useState();
  const [, setLoading] = useGlobalLoading();
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [, setAnexoModal] = useAnexoModal();

  const [userData, setUserData] = useState({
    email: userGlobalState.email,
    message: "",
    anexo: null,
  });

  const {
    sendFriendSolicitation,
    verifyRelationShip,
    undoFriendship,
    blockFriendship,
    unblockFriendship,
  } = useFriendsApi();

  const { listMessages } = useMessageApi();
  const { organizeScroll } = useReognizeScroll();
  const { verifyScrollTop } = useVerifyScrollTop();
  const { setScrollDown } = useSetScrollDown();
  const { addAttachment } = useAttachmentApi();
  const { verifySessionUser } = useVerifySession()

  useEffect(() => {
    setUseSockChat(new SockJS(DOMAIN_SOCK));
    setUseSockNotification(new SockJS(DOMAIN_SOCK));

    setUseIsSocket(1);

    verifyRelationShipService();
  }, []);

  useEffect(() => {
    if (useRelationShip == 0) {
      verifyScrollTop(() => setLoadMore(true), "scroll-chat");
      setFirst(true);
      listMessagesService(null);
    }
  }, [useRelationShip]);

  useEffect(() => {
    if (useIsSocket == 1) {
      setUseStomp({
        ...useStomp,
        chat: over(useSockChat),
        notification: over(useSockNotification),
      });
      setUseIsSocket(2);
    } else if (useIsSocket == 2) {
      connectChat();
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
    verifyRelationShipService();
    setFirst(true);
    setUserData({ ...userData, to: props.to.email });
    listMessagesService(null);
  }, [useMemo(() => props.to)]);

  useEffect(() => {
    if (payloadMessage) {
      if (props.to.email == payloadMessage.from) {
        setChat([...chat, payloadMessage]);
      }
      setPayloadMessage(false);
    }
  }, [payloadMessage]);

  useEffect(() => {
    if (payloadNotification) {
      if (props.to.email == payloadNotification.from) {
        if (payloadNotification.notification) {
          setGlobalModal([
            ...globalModal,
            { message: payloadNotification.notification },
          ]);
        }

        verifyRelationShipService();
      }

      setPayloadNotification(false);
    }
  }, [payloadNotification]);

  useEffect(() => {
    if (loadMore && isNecessaryLoadMore) {
      try {
        listMessagesService(chat[0].index);
      } catch {}
      setLoadMore(false);
    }
  }, [loadMore]);

  useEffect(() => {
    if (userData.anexo) {
      sendMessageChat();
    }
  }, [userData.anexo]);

  const connectChat = () => {
    useStomp.chat.debug = null;
    useStomp.chat.connect({}, onConnectedMessage, onError);
  };

  const connectNotification = () => {
    useStomp.notification.debug = null;
    useStomp.notification.connect({}, onConnectedNotification, onError);
  };

  const listMessagesService = async (index) => {
    setLoading(true);
    try {
      const response = await listMessages(props.to.id, index);

      if (!index) {
        setChat([...response.reverse()]);
      } else {
        if (response.length == 0) {
          setIsNecessaryLoadMore(false);
        } else {
          setIsNecessaryLoadMore(true);
          setChat([...response.reverse(), ...chat]);
        }
      }
    } catch (error) {
      verifySessionUser(error);
    }
    setLoading(false);
  };

  const verifyRelationShipService = async () => {
    try {
      const response = await verifyRelationShip(props.to.id);

      if (useRelationShip == 0 && response == 1) {
        props.return();
      }

      setUseRelationShip(response);
    } catch (error) {
      verifySessionUser(error);
    }
  };

  const onConnectedMessage = () => {
    useStomp.chat.subscribe(
      "/private/" + userData.email + "/chat",
      onMessageChat
    );
  };

  const onConnectedNotification = () => {
    useStomp.notification.subscribe(
      "/private/" + userData.email + "/notification/friends",
      onMessageNotification
    );
  };

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const onMessageNotification = (payload) => {
    let payloadData = JSON.parse(payload.body);

    setPayloadNotification(payloadData);
  };

  const onMessageChat = (payload) => {
    let payloadData = JSON.parse(payload.body);

    setPayloadMessage(payloadData);
  };

  const sendMessageChat = () => {
    if (userData.message.length > 0 || userData.anexo) {
      let chatMessage = {
        index: chat.length + 1,
        from: userGlobalState.email,
        to: userData.to,
        message: userData.message,
        anexoId: userData.anexo?.id,
        anexoName: userData.anexo?.anexoName,
      };

      setChat([...chat, chatMessage]);
      setUserData({ ...userData, message: "", anexo: null });

      useStomp.chat.send("/app/private", {}, JSON.stringify(chatMessage));
    }
  };

  const undoFriendshipService = async () => {
    setLoading(true);
    try {
      await undoFriendship(props.to.id);

      props.return();
    } catch (error) {
      verifySessionUser(error)
    }
    setLoading(false);
  };

  const blockFriendshipService = async () => {
    setLoading(true);
    try {
      await blockFriendship(props.to.id);

      verifyRelationShipService();
    } catch (error) {
      verifySessionUser(error)
    }
    setLoading(false);
  };

  const unblockFriendshipService = async () => {
    setLoading(true);
    try {
      await unblockFriendship(props.to.id);

      verifyRelationShipService();
    } catch (error) {
      verifySessionUser(error)
    }
    setLoading(false);
  };

  const sendAttachment = async (event) => {
    if (event.target.files[0].size <= MAX_FILE) {
      try {
        const formData = new FormData();

        formData.append("file", event.target.files[0]);

        const response = await addAttachment(formData);

        setUserData({ ...userData, anexo: { ...response } });
      } catch (error) {
        verifySessionUser(error)
        if (error.response.data.status == 411) {
          setGlobalModal([
            ...globalModal,
            { message: "Arquivo excedeu o limite de caracteres no nome!! " },
          ]);
        }
      }
    } else {
      setGlobalModal([
        ...globalModal,
        { message: "Arquivo excedeu o limite de upload!!" },
      ]);
    }
  };

  const sendSolicitation = async () => {
    setLoading(true);
    try {
      await sendFriendSolicitation(props.to.id);

      verifyRelationShipService();
    } catch (error) {
      verifySessionUser(error);
    }
    setLoading(false);
  };

  const onError = (error) => {
    console.log(error);
  };

  const returnContentNotification = () => {
    if (useRelationShip == 1) {
      return (
        <>
          <p> Você e o usuario não são amigos ainda!! </p>
          <button onClick={sendSolicitation}> Mandar solicitação</button>
        </>
      );
    } else if (useRelationShip == 2) {
      return <p> Uma solicitação de amizade foi enviada a esse usuario!! </p>;
    } else if (useRelationShip == 3) {
      return <p> O usuario enviou uma solicitação para você!! </p>;
    } else if (useRelationShip == 4) {
      return (
        <>
          <p> Você bloqueou o usuario!!</p>
          <button onClick={unblockFriendshipService}>
            {" "}
            Desbloquear usuario
          </button>
        </>
      );
    } else if (useRelationShip == 5) {
      return <p> O usuario te bloqueou!! </p>;
    }
  };

  const returnNotification = () => {
    if (useRelationShip && useRelationShip != 0) {
      return (
        <>
          <div className="Chat-friend-notification">
            <div className="Chat-friend-image">
              <img
                src={
                  props.to.imagemPerfil
                    ? props.to.imagemPerfil
                    : defaultImgAccount
                }
              />
            </div>
            {returnContentNotification()}
          </div>
          <div className="Chat-friend-exit">
            <button className="button-clear" onClick={props.return}>
              voltar...
            </button>
          </div>
        </>
      );
    }
  };

  const returnChat = () => {
    if (useRelationShip == 0) {
      return (
        <div className="Chat-conversation-section" id="conversation">
          <div className="Chat-conversation-header">
            <button
              className="button-small button-outline"
              onClick={props.return}
            >
              voltar
            </button>
            <div className="Chat-conversation-header-friendship">
              <button
                className="button-small button-black"
                onClick={undoFriendshipService}
              >
                Desfazer amizade
              </button>
              <button
                className="button-small button-black"
                onClick={blockFriendshipService}
              >
                Bloquear usuario
              </button>
            </div>
            <p>
              {" "}
              <strong> {props.to.nome} </strong>
            </p>
          </div>
          <div className="Chat-conversation-content" id="scroll-chat">
            {chat.length > 0
              ? chat.map((message, index) => (
                  <div
                    className="Chat-conversation-content-messages"
                    key={index}
                    style={{
                      justifyContent:
                        message.to == userData.email
                          ? "flex-start"
                          : "flex-end",
                    }}
                  >
                    <div className="Chat-conversation-message">
                      {!message.anexoName ? (
                        <p> {message.message} </p>
                      ) : (
                        <>
                          <img
                            src={downloadImage}
                            onClick={() => setAnexoModal(message.anexoId)}
                          />
                          <p>
                            {" "}
                            <strong> {message.anexoName} </strong>{" "}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="Chat-conversation-send">
            <label htmlFor="file-chat" className="Chat-attachment">
              <input
                type="file"
                name="file"
                id="file-chat"
                className="Chat-input-file"
                onChange={sendAttachment}
              />
              <img src={attachmentImage} />
            </label>
            <input
              className="Chat-conversation-send-input"
              type="text"
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
              enviar{" "}
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
