import { useEffect } from "react";
import { useClassroomSelectedWork } from "../../../globalState/globalState";
import { useSetScrollTop } from "../../../scripts/setScrollTop";
import "./classroom-work-visualizer.style.css";

export const ClassroomWorkVisualizer = () => {
  const [selectedClassroomWork, setSelectedClassroomWork] =
    useClassroomSelectedWork();

    const { setScrollTop } = useSetScrollTop()

    useEffect(() => {
      
      if (selectedClassroomWork) {
        setScrollTop("classroom-tit")
        setScrollTop("classroom-desc")
      }

    }, [selectedClassroomWork])

  
  return (
    <div
      className={"Classroom-section" + (selectedClassroomWork ? " modal" : "")}
      id="classroom"
    >
      <div className="Classroom-container">
        <div
          className="Classroom-exit"
        >
          <button className="button-black button-small"  onClick={() => setSelectedClassroomWork(null)}>X</button>
        </div>
        <div className="Classroom-content">
          <div className="Classroom-item">
            <label> Titulo: </label>
            <blockquote  id="classroom-tit">{selectedClassroomWork?.title}</blockquote>
          </div>
          <div className="Classroom-item">
            <label> Descrição: </label>
            <blockquote  id="classroom-desc">{selectedClassroomWork?.description ? selectedClassroomWork.description : "Não há descrição para esta atividade..."}</blockquote>
          </div>
          <div className="Classroom-item">
            <label> Link: </label>
            <blockquote className="link">
              <a href={selectedClassroomWork?.alternateLink}> {selectedClassroomWork?.alternateLink} </a>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};
