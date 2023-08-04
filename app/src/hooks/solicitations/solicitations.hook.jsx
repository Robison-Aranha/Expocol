import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { useFriendsApi } from "../../api/api";
import { useVerifySession } from "../../api/verifySessions";
import defaultImgAccount from "../../assets/account/default.png";
import "./solicitations.style.css";
import { useGlobalModal, useGlobalState, useSolicitationsModal } from "../../globalState/globalState";

export const Solicitations = () => {
  const [useFriendsSolicitation, setUseFriendsSolicitation] = useState([]);
  const [solicitationsModal, setSolicitationsModal] = useSolicitationsModal()
  const [, setGlobalModal] = useGlobalModal();
  const [userGlobalState] = useGlobalState();
  const [useSock, setUseSock] = useState();
  const [useIsSocket, setUseIsSocket] = useState();
  const [useStomp, setUseStomp] = useState({});
  const [userData, setUserData] = useState({
    email: "",
  });

  useEffect(() => {

    if (userGlobalState) {
      setUserData({ ...userData, email: userGlobalState.email })
      setUseIsSocket(1);
    } 



  }, [userGlobalState])

  const {
    acceptFriendSolicitation,
    ignoreFriendSolicitation,
    listFriendSolicitations,
  } = useFriendsApi();

  const { verifySessionUser } = useVerifySession();

  useEffect(() => {
    setUseSock(new SockJS("http://localhost:8080/ws"));
    listFriendsSolicitationsService();
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
    console.log(userData);
    useStomp.notification.subscribe(
      "/private/" + userData.email + "/notification/solicitacoes",
      onMessageNotification
    );
  };

  const onMessageNotification = (payload) => {
    listFriendsSolicitationsService();

    let payloadData = JSON.parse(payload.body);

    setGlobalModal((prev) => [...prev, { message: payloadData.notification }]);
  };

  const onError = (error) => {
    console.log(error);
  };

  const listFriendsSolicitationsService = async () => {
    try {
      const response = await listFriendSolicitations();

      setUseFriendsSolicitation([...response.content]);
    } catch (error) {
      verifySessionUser(error);
    }
  };

  const acceptSolicictation = async (id) => {
    try {
      await acceptFriendSolicitation(id);
    } catch (error) {
      verifySessionUser(error);
    }
  };

  const ignoreSolicitation = async (id) => {
    try {
      await ignoreFriendSolicitation(id);
    } catch (error) {
      verifySessionUser(error);
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
    <div className={"Friends-section" + (solicitationsModal ? " modal" : "")}>
      <div className="Friends-container">
        <div className="Friends-exit">
          <h2 className="Friends-title">
            <strong>Solicitações</strong>
          </h2>
          <button
            className="Friends-exit-button button-black button-small"
            onClick={() => setSolicitationsModal(false)}
          >
            {" "}
            X{" "}
          </button>
        </div>

        <div className="Friends-content">
          {useFriendsSolicitation.length > 0
            ? useFriendsSolicitation.map((solicitation, index) => (
                <div className="Friends-solicitations" key={index}>
                  <div className="Friends-solicitations-img">
                    <img
                      src={
                        solicitation.imagemPerfil
                          ? solicitation.imagemPerfil
                          : defaultImgAccount
                      }
                    />
                  </div>
                  <div className="Friends-solicitations-content">
                    <p>
                      <strong> {solicitation.nome} </strong>
                    </p>
                  </div>
                  <div className="Friends-solicitation-actions">
                    <button
                      className="button-small"
                      name="accept"
                      onClick={(event) =>
                        handleSolicitationEvent(event, solicitation.id, index)
                      }
                    >
                      {" "}
                      aceitar{" "}
                    </button>
                    <button
                      className="button-small"
                      name="ignore"
                      onClick={(event) =>
                        handleSolicitationEvent(event, solicitation.id, index)
                      }
                    >
                      {" "}
                      ignorar{" "}
                    </button>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};
