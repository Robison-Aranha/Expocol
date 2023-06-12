import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { useFriendsApi } from "../../api/api";
import defaultImgAccount from "../../assets/account/default.png";
import "./solicitations.style.css";
import { useGlobalModal, useGlobalState } from "../../globalState/globalState";

export const Solicitations = (props) => {
  const [useFriendsSolicitation, setUseFriendsSolicitation] = useState([]);
  const [globalModal, setGlobalModal] = useGlobalModal()
  const [userGlobalState] = useGlobalState()
  const [useSock, setUseSock] = useState();
  const [useIsSocket, setUseIsSocket] = useState();
  const [useStomp, setUseStomp] = useState({});
  const [userData] = useState({
    username : userGlobalState.nome
  })

  const {
    acceptFriendSolicitation,
    ignoreFriendSolicitation,
    listFriendSolicitations,
  } = useFriendsApi();

  useEffect(() => {
    setUseSock(new SockJS("http://localhost:8080/ws"));
    listFriendsSolicitationsService();
    setUseIsSocket(1);
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
    console.log(userData)
    useStomp.notification.subscribe(
      "/private/" + userData.username + "/notification/solicitacoes",
      onMessageNotification
    );
  };

  const onMessageNotification = (payload) => {
    listFriendsSolicitationsService();

    let payloadData = JSON.parse(payload.body);

    setGlobalModal([...globalModal, { message: payloadData.notification, color : "green"}])
  };

  const onError = (error) => {
    console.log(error);
  };

  const listFriendsSolicitationsService = async () => {
    try {
      const response = await listFriendSolicitations();
      console.log(response.content);
      setUseFriendsSolicitation([...response.content]);
    } catch (response) {
      console.log(response);
    }
  };

  const acceptSolicictation = async (id) => {
    try {
      await acceptFriendSolicitation(id);
    } catch (response) {
      console.log(response);
    }
  };

  const ignoreSolicitation = async (id) => {
    try {
      await ignoreFriendSolicitation(id);
    } catch (response) {
      console.log(response);
    }
  };

  const handleSolicitationEvent = (event, id, index) => {
    const { name } = event.target;

    if (name == "accept") {
      acceptSolicictation(id);
    } else if (name == "ignore") {
      ignoreSolicitation(id);
    }

    useFriendsSolicitation.splice(index, 1);

    setUseFriendsSolicitation([...useFriendsSolicitation]);
  };

  return (
    <dev className={"Friends-section" + (props.modal == false ? "" : " modal")}>
      <dev className="Friends-container">
        <div className="Friends-exit">
          <p className="Friends-exit-button" onClick={props.setModal}>
            {" "}
            X{" "}
          </p>
        </div>

        <div className="Friends-content">
          {useFriendsSolicitation.length > 0
            ? useFriendsSolicitation.map((solicitation, index) => (
                <dev className="Friends-solicitations" key={index}>
                  <img
                    src={
                      solicitation.imagemPerfil
                        ? solicitation.imagemPerfil
                        : defaultImgAccount
                    }
                    className="Friends-solicitations-img"
                  />
                  <div className="Friends-solicitations-content">
                    <p> {solicitation.nome} </p>
                    <p> {solicitation.email} </p>
                  </div>
                  <div className="Friends-solicitation-actions">
                    <button
                      name="accept"
                      onClick={(event) =>
                        handleSolicitationEvent(event, solicitation.id, index)
                      }
                    >
                      {" "}
                      accept{" "}
                    </button>
                    <button
                      name="ignore"
                      onClick={(event) =>
                        handleSolicitationEvent(event, solicitation.id, index)
                      }
                    >
                      {" "}
                      ignore{" "}
                    </button>
                  </div>
                </dev>
              ))
            : null}
        </div>
      </dev>
    </dev>
  );
};
