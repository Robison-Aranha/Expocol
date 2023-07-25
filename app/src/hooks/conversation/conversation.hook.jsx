import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState, useMemo } from "react";
import { useGlobalModal, useGlobalState, useGlobalLoading, useAnexoModal } from "../../globalState/globalState";
import "./conversation.style.css";
import { useFriendsApi, useMessageApi, useAttachmentApi } from "../../api/api";
import { useReognizeScroll } from "../../scripts/scrollChat";
import { useVerifyScrollTop } from "../../scripts/verifyScrollTop";
import { useSetScrollDown } from "../../scripts/setScrollDown";
import defaultImgAccount from "../../assets/account/default.png"
import attachmentImage from "../../assets/chat/attachment.png"
import downloadImage from "../../assets/chat/download.png"
import { MAX_FILE } from "../../consts/FileMax";


export const Conversation = (props) => {
  const [chat, setChat] = useState([]);
  const [userGlobalState] = useGlobalState();
  const [useRelationShip, setUseRelationShip] = useState();
  const [useSock, setUseSock] = useState();
  const [useIsSocket, setUseIsSocket] = useState();
  const [useStomp, setUseStomp] = useState({});
  const [loadMore, setLoadMore] = useState(false);
  const [isNecessaryLoadMore, setIsNecessaryLoadMore] = useState(true)
  const [first, setFirst] = useState(true);
  const [payloadMessage, setPayloadMessage] = useState()
  const [,setLoading] = useGlobalLoading()
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [, setAnexoModal] = useAnexoModal()

  const [userData, setUserData] = useState({
    email: userGlobalState.email,
    message: "",
    anexo: null
  });

  const { sendFriendSolicitation, verifyRelationShip } = useFriendsApi();
  const { listMessages } = useMessageApi();
  const { organizeScroll } = useReognizeScroll();
  const { verifyScrollTop } = useVerifyScrollTop();
  const { setScrollDown } = useSetScrollDown();
  const { returnAttachment, addAttachment } = useAttachmentApi()

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
    
    setFirst(true)
    setUserData({...userData, to: props.to.email})
    listMessagesService(null)

  }, [useMemo(() => props.to)])

  useEffect(() => {

    if (payloadMessage) {

      if (props.to.email == payloadMessage.from) {
    
        setChat([...chat, payloadMessage]);
      }
      setPayloadMessage(false)
    }

  }, [payloadMessage])


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
      sendMessageChat()
    }

  }, [userData.anexo])

  const connectChat = () => {
    useStomp.chat.debug = null;
    useStomp.chat.connect({}, onConnectedMessage, onError);
  };

  const connectNotification = () => {
    useStomp.notification.debug = null;
    useStomp.notification.connect({}, onConnectedNotification, onError);
  };

  const listMessagesService = async (index) => {
    setLoading(true)
    try {
      const response = await listMessages(props.to.id, index);

      if (!index) {
        setChat([...response.reverse()]);

        if (response.length == 0) {
          setIsNecessaryLoadMore(false)
        } else {
          setIsNecessaryLoadMore(true)
        }
      } else {
        setChat([...response.reverse(), ...chat]);
      }
    } catch (response) {
      console.log(response);
    }
    setLoading(false)
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
    verifyRelationShipService();

    let payloadData = JSON.parse(payload.body);

    setGlobalModal((prev) => [
      ...prev,
      { message: payloadData.notification },
    ]);
  };

  const onMessageChat = (payload) => {
    let payloadData = JSON.parse(payload.body);

    setPayloadMessage(payloadData)
  };

  const sendMessageChat = () => {
    if (userData.message.length > 0 || userData.anexo) {

      let chatMessage = {
        index: chat.length + 1,
        from: userGlobalState.email,
        to: userData.to,
        message: userData.message,
        anexoId: userData.anexo?.id,
        anexoName: userData.anexo?.anexoName
      };

      setChat([...chat, chatMessage]);
      setUserData({ ...userData, message: "", anexo: null });

      useStomp.chat.send("/app/private", {}, JSON.stringify(chatMessage));
    }
  };

  const sendAttachment = async (event) => {

    if (event.target.files[0].size <= MAX_FILE) {

      try {
        const formData = new FormData();

        formData.append("file", event.target.files[0]);

        const response = await addAttachment(formData);

        setUserData({...userData, anexo: {...response} })

      } catch (error)  {
        if (error.response.data.status == 411) {
          setGlobalModal([...globalModal, { message: "Arquivo excedeu o limite de caracteres no nome!! "}])
        }
      }

    } else {
      setGlobalModal([...globalModal, { message: "Arquivo excedeu o limite de upload!!" }])
    }

  }

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


  const returnContentNotification = () => {

    if (useRelationShip == 1) {

      return (
        <>
          <p> Você e o usuario não são amigos ainda!! </p>
          <button onClick={sendSolicitation}> mandar solicitação</button>
        </>
      )
    }
    else if (useRelationShip == 2) {
      return (
        <p> Uma solicitação de amizade foi enviada a esse usuario!! </p>
      )
    } else if (useRelationShip == 3) {
      return (
        <p> O usuario enviou uma solicitação para você!! </p>
      )
    }



  }


  const returnNotification = () => {
    if (useRelationShip == 1 || useRelationShip == 2 || useRelationShip == 3) {
      return (
        <>
          <div className="Chat-friend-notification">
            <div className="Chat-friend-image">
              <img src={props.to.imagemPerfil ? props.to.imagemPerfil : defaultImgAccount} />
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
        <div className="Chat-conversation-section">
          <div className="Chat-conversation-exit">
            <button
              className="button-small button-outline"
              onClick={props.return}
            >
              voltar
            </button>
            <p>
              {" "}
              <strong> {props.to.nome} </strong>
            </p>
          </div>
          <div className="Chat-conversation-content" id="scroll-chat">
            {chat.length > 0
              ? chat.map((menssage, index) => (
                  <div
                    className="Chat-conversation-content-messages"
                    key={index}
                    style={{
                      justifyContent:
                        menssage.to == userData.email
                          ? "flex-start"
                          : "flex-end",
                    }}
                  >
                    <div className="Chat-conversation-message">
                      { !menssage.anexoName ? <p> {menssage.message} </p> : 
                      <>
                        <img src={downloadImage} onClick={() => setAnexoModal(menssage.anexoId)} />
                        <p> <strong> {menssage.anexoName} </strong> </p>
                      </> 
                      }
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="Chat-conversation-send">
            <label  htmlFor="file-chat" className="Chat-attachment">
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
