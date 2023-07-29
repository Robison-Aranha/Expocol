import {
  useGlobalIndexesModal,
  useGlobalIndex,
  useGlobalCalendar,
  useAnexoModal,
  useImageTextAnaliserModal
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
  ImageTextAnaliser
} from "../../hooks/hooks";
import "./home.style.css";

export const Home = () => {
  const [indexesGlobalStateModal, setIndexesGlobalIndexModal] =
    useGlobalIndexesModal();
  const [, setGlobalCalendar] = useGlobalCalendar();
  const [globalIndex, setGlobalIndex] = useGlobalIndex();
  const [anexoModal, setAnexoModal] = useAnexoModal()
  const [imageTextAnaliserModal, setImageTextAnaliserModal] = useImageTextAnaliserModal()

  const handleIndexModal = (event) => {
    const indexContainer = document.getElementById("index");
    const fileSection = document.getElementById("file-index-section");
    const fileContainer = document.getElementById("file-index-container");
    const eventSection = document.getElementById("event");
    const classroomSection = document.getElementById("classroom")

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

    const anexoContainer = document.getElementById("anexo")

    if (!anexoContainer.contains(event.target) && anexoModal) {
      setAnexoModal(false)
    }

  }

  const handleImageTextAnaliserModal = (event) => {

    const imageTextAnaliserContainer = document.getElementById("imageTextAnaliser")

    if (!imageTextAnaliserContainer.contains(event.target) && imageTextAnaliserModal) {
      setImageTextAnaliserModal(false)
    }

  }

  return (
    <div className="Home-section" onClick={(event) => {
        handleIndexModal(event)
        handleAnexoModal(event)
        handleImageTextAnaliserModal(event)
      }}>
      <Notification />
      <ToPBar />
      <Calendar />
      <Indexes />
      <FileVisualizer />
      <AnexoFile />
      <ImageTextAnaliser />
      <EventVisualizerCreator />
      <ClassroomWorkVisualizer />
      <ChangeProfile />
      <Loading />
    </div>
  );
};
