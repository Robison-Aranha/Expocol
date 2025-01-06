import { useEffect, useState } from "react";
import {
  useGlobalIndexesModal,
  useGlobalIndex,
  useGlobalCalendar,
  useAnexoModal,
  useImageTextAnaliserModal,
} from "../../globalState/globalState";
import {
  FileVisualizer,
  ToPBar,
  Notification,
  Calendar,
  Loading,
  EventVisualizerCreator,
  Indexes,
  ClassroomWorkVisualizer,
  ChangeProfile,
  AnexoFile,
  ImageTextAnaliser,
  Dictionary,
  NewsPaper,
  Chat,
  Solicitations,
  ModalWelcome,
} from "../../hooks/hooks";
import { useLocation } from "react-router-dom";
import "./home.style.css";

export const Home = () => {
  const [indexesGlobalStateModal, setIndexesGlobalIndexModal] =
    useGlobalIndexesModal();
  const [, setGlobalCalendar] = useGlobalCalendar();
  const [globalIndex, setGlobalIndex] = useGlobalIndex();
  const [anexoModal, setAnexoModal] = useAnexoModal();
  const [imageTextAnaliserModal, setImageTextAnaliserModal] =
    useImageTextAnaliserModal();
  const [isFirst, setIsFirst] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state == "first") {
      setIsFirst(true);
    }
  }, []);

  const handleIndexModal = (event) => {
    const indexContainer = document.getElementById("index");
    const fileSection = document.getElementById("file-index-section");
    const fileContainer = document.getElementById("file-index-container");
    const eventSection = document.getElementById("event");
    const classroomSection = document.getElementById("classroom");

    if (
      !indexContainer.contains(event.target) &&
      indexesGlobalStateModal &&
      !fileSection.contains(event.target) &&
      !eventSection.contains(event.target) &&
      !classroomSection.contains(event.target)
    ) {
      setGlobalCalendar(null);
      setIndexesGlobalIndexModal(false);
    }

    if (!fileContainer.contains(event.target) && globalIndex) {
      setGlobalIndex(false);
    }
  };

  const handleAnexoModal = (event) => {
    const anexoContainer = document.getElementById("anexo");

    if (!anexoContainer.contains(event.target) && anexoModal) {
      setAnexoModal(false);
    }
  };

  const handleImageTextAnaliserModal = (event) => {
    const imageTextAnaliserContainer =
      document.getElementById("imageTextAnaliser");

    if (
      !imageTextAnaliserContainer.contains(event.target) &&
      imageTextAnaliserModal
    ) {
      setImageTextAnaliserModal(false);
    }
  };

  return (
    <div
      className="Home-section"
      onClick={(event) => {
        handleIndexModal(event);
        handleAnexoModal(event);
        handleImageTextAnaliserModal(event);
      }}
    >
      <Notification />
      <ToPBar />
      <Calendar />
      <Chat />
      <Solicitations />
      <Indexes />
      <FileVisualizer />
      <AnexoFile />
      <Dictionary />
      <NewsPaper />
      <ImageTextAnaliser />
      <EventVisualizerCreator />
      <ClassroomWorkVisualizer />
      <ChangeProfile />
      <Loading />
      <ModalWelcome modal={isFirst} setModal={() => setIsFirst(false)} />
    </div>
  );
};
