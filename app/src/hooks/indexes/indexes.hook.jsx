import { useEffect, useState } from "react";
import { useCalendarApi } from "../../api/api";
import "./indexes.style.css";
import {
  useGlobalModal,
  useGlobalIndexesModal,
  useGlobalIndex,
  useGlobalEvent,
  useGlobalCalendar,
  useLoadCalendar,
  useClassroomUtils,
  useClassroomSelectedWork,
  useGlobalLoading
} from "../../globalState/globalState";
import { MAX_FILE } from "../../consts/FileMax";
import { useSetScrollTop } from "../../scripts/setScrollTop";

export const Indexes = () => {
  const [files, setFiles] = useState([]);
  const [events, setEvents] = useState([]);
  const [indexesGlobalState, setIndexesGlobalState] = useGlobalIndexesModal();
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [globalIndex, setGlobalIndex] = useGlobalIndex();
  const [globalEvent, setGlobalEvent] = useGlobalEvent();
  const [, setLoading] = useGlobalLoading()
  const [classroomUtils, ] = useClassroomUtils();
  const [, setSelectedClassroomWork] = useClassroomSelectedWork()
  const [, setLoadCalendar] = useLoadCalendar();
  const [globalCalendar] = useGlobalCalendar();

  const { returnIndexesEvents, addIndex } = useCalendarApi();
  const { setScrollTop } = useSetScrollTop();

  useEffect(() => {
    if (globalCalendar) {
      returnIndexesEventsService();
    }
  }, [globalCalendar]);

  useEffect(() => {
    if (!globalIndex || globalEvent.load) {
      returnIndexesEventsService();
      setGlobalEvent({ ...globalEvent, load: false });
    }
  }, [globalIndex, globalEvent.load]);

  useEffect(() => {
    
    if (indexesGlobalState) {
      setScrollTop("index")
    }

  }, [indexesGlobalState])

  const returnIndexesEventsService = async () => {
    setLoading(true)
    try {
      const response = await returnIndexesEvents(
        globalCalendar.ano,
        globalCalendar.mes,
        globalCalendar.dia
      );
      
      setFiles([...response.indexes]);
      setEvents([...response.eventos]);
      setIndexesGlobalState(true);
    } catch (response) {}

    setLoading(false)
  };

  const addIndexService = async (event) => {
    setLoading(true)

    if (event.target.files[0].size <= MAX_FILE) {

      try {
        const formData = new FormData();

        formData.append("file", event.target.files[0]);

        await addIndex(
          globalCalendar.ano,
          globalCalendar.mes,
          globalCalendar.dia,
          formData
        );

        event.target.value = "";

        setLoadCalendar(true);
        returnIndexesEventsService();
        setGlobalModal([
          ...globalModal,
          { message: "Arquivo adicionado com sucesso!" },
        ]);
      } catch (error) {
        
        if (error.response.data.status == 411) {
          setGlobalModal([...globalModal, { message: "Arquivo excedeu o limite de caracteres no nome!! "}])
        }

        event.target.value = "";
      }
    } else {
      setGlobalModal([...globalModal, { message: "Arquivo excedeu o limite de upload!!"}])
    }
    setLoading(false)
  };

  const returnClassroomMonthWorks = () => {
    if (classroomUtils.courses && classroomUtils.monthWorks && globalCalendar) {
      if (classroomUtils.monthWorks[`${globalCalendar.dia}`]) {
        return (
          <div className="Indexes-content">
            <h1> Trabalhos Classroom </h1>
            <div className="Indexes-details">
              {classroomUtils.monthWorks[`${globalCalendar.dia}`].map((work, key) => (
                <div className="Indexes-item button button-classroom" key={key} onClick={() => setSelectedClassroomWork({...work})}>
                  <p> {work.title} </p>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className={"Indexes-section" + (indexesGlobalState ? " modal" : "")}>
      <div className="Indexes-container" id="index">
        <div className="Indexes-content">
          <h1> Arquivos </h1>
          <p>
            {" "}
            Os arquivos devem ter um maximo de 25 caracteres em seus titulos!
          </p>
          <p> <strong>  30MB permitido para upload... </strong> </p>
          <div className="Indexes-details">
            {files.length > 0 ? (
              files.map((file, index) => (
                <div
                  className="Indexes-item button button-outline"
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
        <div className="Indexes-content">
          <h1> Eventos </h1>
          <div className="Indexes-details">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div
                  className="Indexes-item button button-clear"
                  onClick={() =>
                    setGlobalEvent({
                      ...globalEvent,
                      visualization: true,
                      event: event.id,
                      mode: 1,
                    })
                  }
                  key={index}
                >
                  <p>
                    {(event.tempo)}
                  </p>
                </div>
              ))
            ) : (
              <p> Não há eventos marcados ainda... </p>
            )}
          </div>
        </div>
        {returnClassroomMonthWorks()}
        <div className="Indexes-choice">
          <input
            type="file"
            name="file"
            id="file-index"
            className="Indexes-input-file"
            onChange={addIndexService}
          />
          <label className="button" htmlFor="file-index">
            Choose a file
          </label>
          <button
            onClick={() =>
              setGlobalEvent({ ...globalEvent, visualization: true, mode: 0 })
            }
          >
            {" "}
            Adicionar evento{" "}
          </button>
        </div>
      </div>
    </div>
  );
};
