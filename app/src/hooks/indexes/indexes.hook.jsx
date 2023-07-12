import { useEffect, useState } from "react";
import { useCalendarApi } from "../../api/api";
import "./indexes.style.css";
import {
  useGlobalModal,
  useGlobalIndexModal,
  useGlobalIndex,
  useGlobalEvent,
  useGlobalCalendar,
  useLoadCalendar
} from "../../globalState/globalState";

export const Indexes = () => {
  const [files, setFiles] = useState([]);
  const [events, setEvents] = useState([]);
  const [indexGlobalState, setIndexGlobalState] = useGlobalIndexModal();
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [globalIndex, setGlobalIndex] = useGlobalIndex();
  const [globalEvent, setGlobalEvent] = useGlobalEvent()
  const [, setLoadCalendar] = useLoadCalendar()
  const [globalCalendar, ] = useGlobalCalendar()

  const { returnIndexesEvents, addIndex } = useCalendarApi();

  useEffect(() => {

    if (globalCalendar) {

      returnIndexesEventsService()
      
    }

  }, [globalCalendar])

  useEffect(() => {

    if (!globalIndex ||  globalEvent.sent) {
      returnIndexesEventsService();
      setGlobalEvent({...globalEvent, sent: false})
    }
  }, [globalIndex, globalEvent.sent]);

  const returnIndexesEventsService = async () => {
    try {
      const response = await returnIndexesEvents(globalCalendar.ano, globalCalendar.mes, globalCalendar.dia);

      setFiles([...response.indexes]);
      setEvents([...response.eventos]);
      setIndexGlobalState(true)
    } catch (response) {}
  };

  const addIndexService = async (event) => {
    try {
      const formData = new FormData();

      formData.append("file", event.target.files[0]);

      await addIndex(globalCalendar.ano, globalCalendar.mes, globalCalendar.dia, formData);

      event.target.value = "";


      setLoadCalendar(true)
      returnIndexesEventsService();
      setGlobalModal([
        ...globalModal,
        { message: "Arquivo adicionado com sucesso!", color: "green" },
      ]);
    } catch (error) {
      console.log(error);
      setGlobalModal([
        ...globalModal,
        { message: error.response.data.message },
      ]);

      event.target.value = "";
    }
  }

  return (
    <div className={ "Indexes-section" + (indexGlobalState ? " modal" : "") } >
      <div className="Indexes-container" id="index">
        <div className="Indexes-files">
          <h1> Arquivos </h1>
          <p>
            {" "}
            Os arquivos devem ter um maximo de 25 caracteres em seus titulos!
          </p>
          <div className="Indexes-files-content">
            {files.length > 0 ? (
              files.map((file, index) => (
                <div
                  className="Indexes-file button button-outline"
                  onClick={() => setGlobalIndex(file.id)}
                  key={index}
                >
                  <p>{file.indexName}</p>
                </div>
              ))
            ) : (
              <p> Não há arquivos anexados ainda... </p>
            )}
          </div>
        </div>
        <div className="Indexes-events">
          <h1> Eventos </h1>
          <div className="Indexes-events-content">
            {events.length > 0 ? (
                events.map((event, index) => (
                  <div
                    className="Indexes-event button button-clear"
                    onClick={() => setGlobalEvent({...globalEvent, visualization: true, event: event.id, mode: 1})}
                    key={index}
                  >
                    <p>{event.titulo + (event.tempo ? " : " + event.tempo : "" )}</p>
                  </div>
                ))
              ) : (
                <p> Não há eventos marcados ainda... </p>
              )}
          </div>
          <div></div>
        </div>
        <div className="Indexes-choice">
          <input
            type="file"
            name="file"
            id="file"
            className="Indexes-input-file"
            onChange={addIndexService}
          />
          <label className="button" htmlFor="file">
            Choose a file
          </label>
          <button onClick={() => setGlobalEvent({...globalEvent, visualization: true, mode: 0})}> Adicionar evento </button>
        </div>
      </div>
    </div>
  );
};
