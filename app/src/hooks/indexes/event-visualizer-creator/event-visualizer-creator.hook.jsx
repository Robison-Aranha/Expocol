import { useEffect, useState } from "react";
import { months } from "../../../consts/months";
import {
  useSchedulerApi,
  useCalendarApi,
  useLoginRegister,
} from "../../../api/api";
import {
  useGoogleCredentials,
  useGlobalCalendar,
  useGlobalLoading,
  useGlobalModal,
  useGlobalEvent,
  useGlobalState,
  useLoadCalendar,
} from "../../../globalState/globalState";
import { useVerifySession } from "../../../api/verifySessions";
import "./event-visualizer-creator.style.css";
import "@js-joda/locale_en-us";
import {
  LocalDateTime,
  LocalDate,
  LocalTime,
  DateTimeFormatter,
  ChronoUnit,
} from "@js-joda/core";

export const EventVisualizerCreator = () => {
  const [userData, setUserData] = useState({
    titulo: "",
    descricao: "",
    tempo: "",
    dateEmail: "",
    sendEmail: false,
  });

  const [googleCredentials] = useGoogleCredentials();
  const [, setLoading] = useGlobalLoading();
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [globalEvent, setGlobalEvent] = useGlobalEvent();
  const [userGlobalState, setUserGlobalState] = useGlobalState();
  const [, setLoadCalendar] = useLoadCalendar();
  const [globalCalendar] = useGlobalCalendar();
  const [verifyActualDate, setVerifyActualDate] = useState();
  const [event, setEvent] = useState();

  const { addEvent, returnEvent, deleteEvent } = useCalendarApi();
  const { verifySessionUser } = useVerifySession();
  const { sendEmail } = useSchedulerApi();
  const { refreshToken } = useLoginRegister();

  useEffect(() => {
    if (globalCalendar) {
      verifyActualDayToSelectedDay();
    }
  }, [globalCalendar]);

  useEffect(() => {
    if (globalEvent.visualization) {
      createEventService();
    }
  }, [userGlobalState.schedulerKey]);

  useEffect(() => {
    if (globalEvent.visualization) {
      if (globalEvent.mode == 0) {
        setUserData({
          titulo: "",
          descricao: "",
          tempo: LocalTime.now().truncatedTo(ChronoUnit.MINUTES).toString(),
          email: false,
          dateEmail: LocalDateTime.of(
            LocalDate.of(
              globalCalendar.ano,
              months.findIndex((item) => item == globalCalendar.mes) + 1,
              globalCalendar.dia
            ),
            LocalTime.now()
          )
            .truncatedTo(ChronoUnit.MINUTES)
            .toString(),
          sendEmail: false,
        });

        if (!verifyActualDate) {
          setGlobalModal([
            ...globalModal,
            { message: "Data anterior a atual!! Envio de email dasativado!" },
          ]);
        } else if (!googleCredentials) {
          setGlobalModal([
            ...globalModal,
            {
              message:
                "Você não esta logado com o google!! Envio de email desabilitado!",
            },
          ]);
        }

        verifyGoogleDayOption();
      } else if (globalEvent.mode == 1) {
        returnEventService();
      }
    }
  }, [globalEvent.visualization]);

  const returnEventService = async () => {
    setLoading(true);
    try {
      const response = await returnEvent(globalEvent.event);

      setEvent({ ...response });
    } catch (error) {
      verifySessionUser(error);
    }
    setLoading(false);
  };

  const deleteEventService = async () => {
    setLoading(true);
    try {
      await deleteEvent(globalEvent.event);

      setGlobalEvent({ ...globalEvent, visualization: false, load: true });

      setGlobalModal([
        ...globalModal,
        { message: "Evento excluido com sucesso!" },
      ]);

      setLoadCalendar(true);
    } catch (error) {
      verifySessionUser(error);
    }
    setLoading(false);
  };

  const createEventService = async () => {
    setLoading(true);
    if (
      verifyInputsEmails() &&
      verifyValueTime() &&
      (googleCredentials && userData.sendEmail ? verifyValueDateEmail() : true)
    ) {
      try {
        let response = {};

        if (googleCredentials && userData.sendEmail) {
          response = await sendEmail(
            googleCredentials.email,
            userData.descricao,
            userData.dateEmail,
            userGlobalState.zoneId
          );
        }

        await addEvent(
          userData.titulo,
          userData.descricao,
          userData.tempo,
          googleCredentials && userData.sendEmail ? userData.dateEmail : null,
          response.name,
          response.group,
          globalCalendar.ano,
          globalCalendar.mes,
          globalCalendar.dia
        );

        setGlobalEvent({ ...globalEvent, load: true });

        setGlobalModal([
          ...globalModal,
          { message: "Evento adicionado com sucesso!! " },
        ]);
        setUserData({
          titulo: "",
          descricao: "",
          tempo: LocalTime.now().truncatedTo(ChronoUnit.MINUTES).toString(),
          email: false,
          dateEmail: LocalDateTime.of(
            LocalDate.of(
              globalCalendar.ano,
              months.findIndex((item) => item == globalCalendar.mes) + 1,
              globalCalendar.dia
            ),
            LocalTime.now()
          )
            .truncatedTo(ChronoUnit.MINUTES)
            .toString(),
          sendEmail: false,
        });

        setLoadCalendar(true);
        verifyGoogleDayOption();
      } catch (error) {
        if (error.config.baseURL.includes("email")) {
          if (error.response.status == 401) {
            try {
              const response = await refreshToken();

              setUserGlobalState({
                ...userGlobalState,
                schedulerKey: response.token,
              });
            } catch (errorRefresh) {
              verifySessionUser(errorRefresh);
            }
          }

          setGlobalModal([
            ...globalModal,
            { message: "Erro ao agendar email! Tente novamente mais tarde!! " },
          ]);
        } else {
          verifySessionUser(error);
        }
      }
    }

    setLoading(false);
  };

  const verifyInputsEmails = () => {
    let verificador = true;

    if (userData.titulo == "") {
      verificador = false;
    } else if (userData.descricao == "") {
      verificador = false;
    } else if (userData.tempo == "") {
      verificador = false;
    }

    if (!verificador) {
      setGlobalModal([...globalModal, { message: "Valores invalidos!! " }]);
    }

    return verificador;
  };

  const verifyActualDayToSelectedDay = () => {
    const actualMes =
      months.indexOf(
        months.find((d) => d == globalCalendar.mes.toUpperCase())
      ) + 1;

    const actualDate = LocalDate.of(
      globalCalendar.ano,
      actualMes,
      globalCalendar.dia
    );

    if (actualDate.isBefore(LocalDate.now())) {
      setVerifyActualDate(false);
      return;
    }

    setVerifyActualDate(true);
  };

  const verifyGoogleDayOption = () => {
    const tags = document.getElementsByClassName("google-optional");

    if (!(googleCredentials && verifyActualDate)) {
      for (let c = 0; c < tags.length; c++) {
        tags[c].style.opacity = 0.5;
      }
    } else {
      for (let c = 0; c < tags.length; c++) {
        if (tags[c].children[1].name == "dateEmail") {
          tags[c].style.opacity = 0.5;
        } else {
          tags[c].style.opacity = 1;
        }
      }
    }
  };

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlerTitle = (event) => {
    if (event.target.value.length <= 40) {
      handlerValue(event);
    }
  };

  const verifyValueTime = () => {
    if (
      LocalDate.now().dayOfMonth() == globalCalendar.dia &&
      LocalTime.parse(userData.tempo).isBefore(LocalTime.now())
    ) {
      setGlobalModal([
        ...globalModal,
        { message: "Horario invalido!! Tempo anterior ao atual!!" },
      ]);
      return false;
    }

    return true;
  };

  const handleEmailCheckbox = () => {
    if (googleCredentials && verifyActualDate) {
      const element = document.getElementsByName("dateEmail")[0];

      if (!userData.sendEmail) {
        element.parentElement.style.opacity = 1;

        setUserData({ ...userData, sendEmail: true });
      } else {
        element.parentElement.style.opacity = 0.5;

        setUserData({ ...userData, sendEmail: false });
      }
    }
  };

  const handleValueDateEmail = (event) => {
    if (googleCredentials && verifyActualDate) {
      handlerValue(event);
    }
  };

  const verifyValueDateEmail = () => {
    const eventDate = LocalDate.of(
      globalCalendar.ano,
      months.findIndex((item) => item == globalCalendar.mes) + 1,
      globalCalendar.dia
    );
    const selectedDate = LocalDateTime.parse(userData.dateEmail).toLocalDate();
    const selectedTime = LocalDateTime.parse(userData.dateEmail).toLocalTime();

    if (selectedDate.isAfter(eventDate)) {
      setGlobalModal([
        ...globalModal,
        {
          message: "Agendamento de envio invalido! Data posterior ao evento!!",
        },
      ]);
      return false;
    } else if (
      eventDate.isEqual(selectedDate) &&
      selectedTime.isAfter(LocalTime.parse(userData.tempo))
    ) {
      setGlobalModal([
        ...globalModal,
        {
          message: "Agendamento de envio invalido! Tempo posterior ao evento!!",
        },
      ]);
      return false;
    } else if (selectedDate.isBefore(LocalDate.now())) {
      setGlobalModal([
        ...globalModal,
        { message: "Agendamento de envio invalido! Data anterior a atual!!" },
      ]);
      return false;
    }

    return true;
  };

  const returnEventContent = () => {
    if (globalEvent.mode == 0) {
      return (
        <>
          <div className="Event-item">
            <label> Titulo: </label>
            <p> Máximo de 40 caracteres! </p>
            <input
              type="text"
              name="titulo"
              placeholder="Digite o titulo"
              onChange={handlerTitle}
              value={userData.titulo}
              autoComplete="off"
            />
          </div>
          <div className="Event-item">
            <label> Descrição: </label>
            <input
              type="text"
              name="descricao"
              placeholder="Digite uma descrição"
              onChange={handlerValue}
              value={userData.descricao}
              autoComplete="off"
            />
          </div>
          <div className="Event-item">
            <label> Horario: </label>
            <input
              type="time"
              name="tempo"
              placeholder="Digite uma data"
              onChange={handlerValue}
              value={userData.tempo}
            />
          </div>
          <div className="Event-item google-optional">
            <label> Data de notificação: </label>
            <input
              disabled={!userData.sendEmail}
              type="datetime-local"
              name="dateEmail"
              placeholder="Digite uma data"
              onChange={handleValueDateEmail}
              value={userData.dateEmail}
            />
          </div>
          <div className="Event-item-email google-optional">
            <input
              type="checkbox"
              name="email"
              className="checkbox"
              disabled={!(googleCredentials && verifyActualDate)}
              onChange={handleEmailCheckbox}
              checked={userData.sendEmail}
            />
            <label> Deseja receber notificação via email? </label>
          </div>
          <div className="Event-choice">
            <button onClick={createEventService}>Enviar</button>
          </div>
        </>
      );
    } else if (globalEvent.mode == 1 && event) {
      return (
        <>
          <div className="Event-item">
            <label> Titulo: </label>
            <blockquote> {event.titulo} </blockquote>
          </div>
          <div className="Event-item">
            <label> Descrição: </label>
            <blockquote className="overflow-event">
              {" "}
              {event.descricao}{" "}
            </blockquote>
          </div>
          <div className="Event-item">
            <label> Horario: </label>
            <blockquote>
              {" "}
              {LocalTime.parse(event.tempo).format(
                DateTimeFormatter.ofPattern("HH:mm")
              )}{" "}
            </blockquote>
          </div>
          <div className="Event-item">
            <label> Data Notificação: </label>
            <blockquote>
              {" "}
              {event.dataNotificacao
                ? LocalDateTime.parse(event.dataNotificacao).format(
                    DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                  )
                : "Envio de email não habilitado..."}{" "}
            </blockquote>
          </div>
          <div className="Event-item-choice">
            <button className="button-black" onClick={deleteEventService}>
              Deletar
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div
      className={"Event-section" + (globalEvent.visualization ? " modal" : "")}
      id="event"
    >
      <div className="Event-container">
        <div className="Event-exit">
          <button
            className="Event-exit-button button-black button-small"
            onClick={() => {
              setGlobalEvent({
                ...globalEvent,
                visualization: false,
                event: null,
              });
              setEvent(null);
            }}
          >
            x
          </button>
        </div>
        <div className="Event-title">
          <h2>
            {globalEvent.mode == 1
              ? "Informações do evento"
              : "Cadastrar Evento"}
          </h2>
        </div>
        <div className="Event-content">{returnEventContent()}</div>
      </div>
    </div>
  );
};
