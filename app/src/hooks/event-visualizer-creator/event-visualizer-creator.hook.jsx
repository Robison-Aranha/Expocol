import { useEffect, useState } from "react";
import { months } from "../../consts/months";
import {
  useSchedulerApi,
  useCalendarApi
} from "../../api/api";
import {
  useGoogleCredentials,
  useGlobalCalendar,
  useGlobalLoading,
  useGlobalModal,
  useGlobalEvent,
  useGlobalState
} from "../../globalState/globalState";
import "./event-visualizer-creator.style.css";
import {
  LocalDateTime,
  LocalDate,
  LocalTime,
  DateTimeFormatter
  ChronoUnit
} from "@js-joda/core";

export const EventVisualizerCreator = () => {
  const [userData, setUserData] = useState({
    titulo: "",
    descricao: "",
    tempo: LocalTime.now().truncatedTo(ChronoUnit.MINUTES).toString(),
    dateEmail: LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES).toString(),
    sendEmail: false,
  });

  const [googleCredentials] = useGoogleCredentials();
  const [, setLoading] = useGlobalLoading();
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [globalEvent, setGlobalEvent] = useGlobalEvent();
  const [userGlobalState, ] = useGlobalState()
  const [globalCalendar] = useGlobalCalendar();
  const [verifyActualDate, setVerifyActualDate] = useState();
  const [event, setEvent] = useState();

  const { addEvent, returnEvent } = useCalendarApi();
  const { sendEmail } = useSchedulerApi();

  useEffect(() => {
    if (globalCalendar) {
      verifyActualDayToSelectedDay();
    }
  }, [globalCalendar]);

  useEffect(() => {
    if (globalEvent.visualization) {
      setUserData({
        titulo: "",
        descricao: "",
        tempo: LocalTime.now().truncatedTo(ChronoUnit.MINUTES).toString(),
        email: false,
        dateEmail: LocalDateTime.now()
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
    }
  }, [globalEvent.visualization]);

  useEffect(() => {
    if (globalEvent.event) {
      returnEventService();
    }
  }, [globalEvent.event]);

  const returnEventService = async () => {
    try {
      const response = await returnEvent(globalEvent.event);

      console.log(response)

      setEvent({ ...response });
    } catch (response) {}
  };

  const createEventService = async () => {
    if (verifyInputsEmails()) {
      try {
        setLoading(true);
      
        let response = {}
        console.log(userGlobalState)

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
          (googleCredentials && userData.sendEmail) ? userData.dateEmail : null,
          response.name,
          response.group,
          globalCalendar.ano,
          globalCalendar.mes,
          globalCalendar.dia
        );

        setGlobalEvent({ ...globalEvent, sent: true });

        setLoading(false);

        setEvent(null)

        setGlobalModal([
          ...globalModal,
          { message: "Evento adicionado com sucesso!! " },
        ]);
        setUserData({
          titulo: "",
          descricao: "",
          tempo: LocalTime.now().truncatedTo(ChronoUnit.MINUTES).toString(),
          email: false,
          dateEmail: LocalDateTime.now()
            .truncatedTo(ChronoUnit.MINUTES)
            .toString(),
          sendEmail: false,
        });

        verifyGoogleDayOption()
      } catch (response) {
        console.log(response);
        setLoading(false);
      }
    } else {
      setGlobalModal([
        ...globalModal,
        { message: "Valores invalidos! Tente novamente!" },
      ]);
    }
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
    console.log(tags)
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

  const handleValueTime = (event) => {
    if (
      LocalDate.now().dayOfMonth() == globalCalendar.dia &&
      LocalTime.parse(event.target.value).isBefore(LocalTime.now())
    ) {
      setGlobalModal([
        ...globalModal,
        { message: "Horario invalido!! Tempo anterior ao atual!!" },
      ]);
    } else {
      handlerValue(event);
    }
  };

  const handleEmailCheckbox = () => {
    const element = document.getElementsByName("dateEmail")[0];

    if (!userData.sendEmail) {
      element.parentElement.style.opacity = 1;

      setUserData({ ...userData, sendEmail: true });
    } else {
      element.parentElement.style.opacity = 0.5;

      setUserData({ ...userData, sendEmail: false });
    }
  };

  const handleValueDateEmail = (event) => {
    const actualDate = LocalDate.now();
    const selectedDate = LocalDateTime.parse(event.target.value).toLocalDate();
    const actualTime = LocalTime.now();
    const selectedTime = LocalDateTime.parse(event.target.value).toLocalTime();

    if (
      selectedDate.isBefore(actualDate) ||
      (selectedDate.isEqual(actualDate) && actualTime.isAfter(selectedTime))
    ) {
      setGlobalModal([
        ...globalModal,
        {
          message:
            "Horário de envio invalido!! Tempo anterior/igual ao atual!!",
        },
      ]);
    } else {
      handlerValue(event);
    }
  };

  const returnEventContent = () => {
    if (!globalEvent.event) {
      return (
        <>
          <div className="Event-item">
            <label> Titulo: </label>
            <input
              type="text"
              name="titulo"
              placeholder="Digite o titulo"
              onChange={handlerValue}
              value={userData.titulo}
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
            />
          </div>
          <div className="Event-item">
            <label> Horario: </label>
            <input
              type="time"
              name="tempo"
              min={LocalTime.now().truncatedTo(ChronoUnit.MINUTES).toString()}
              placeholder="Digite uma data"
              onChange={handleValueTime}
              value={userData.tempo}
              disabled={!verifyActualDate}
            />
          </div>
          <div className="Event-item google-optional">
            <label> Data de notificação: </label>
            <input
              disabled={!userData.sendEmail}
              type="datetime-local"
              name="dateEmail"
              min={LocalDateTime.now()
                .truncatedTo(ChronoUnit.MINUTES)
                .toString()}
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
    } else if (globalEvent.event && event) {
      return (
        <>
          <div className="Event-item">
            <label> Titulo: </label>
            <blockquote> {event.titulo} </blockquote>
          </div>
          <div className="Event-item">
            <label> Descriçao </label>
            <blockquote> {event.descricao} </blockquote>
          </div>
          <div className="Event-item">
            <label> Horario: </label>
            <blockquote> {event.tempo} </blockquote>
          </div>
          <div className="Event-item">
            <label> Data Notificação: </label>
            <blockquote> {event.dataNotificacao ? LocalDateTime.parse(event.dataNotificacao, DateTimeFormatter.ofPattern("DD/MM/YYYY hh:mm")).toString() : "Envio de email não habilitado"} </blockquote>
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
            onClick={() =>
              setGlobalEvent({ ...globalEvent, visualization: false, event: null })
            }
          >
            x
          </button>
        </div>
        <div> 
          <h2>
            { globalEvent.event ? "Informações do evento" : "Cadastrar Evento" }
          </h2>
        </div>
        <div className="Event-content">{returnEventContent()}</div>
      </div>
    </div>
  );
};
