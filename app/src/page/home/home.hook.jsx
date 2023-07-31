import {
  useGlobalIndexesModal,
  useGlobalIndex,
  useGlobalCalendar,
  useAnexoModal,
  useImageTextAnaliserModal,
  useGradeCorrectorModal
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
  GradeCorrector,
  Dictionary
} from "../../hooks/hooks";
import "./home.style.css";

export const Home = () => {
  const [indexesGlobalStateModal, setIndexesGlobalIndexModal] =
    useGlobalIndexesModal();
  const [, setGlobalCalendar] = useGlobalCalendar();
  const [globalIndex, setGlobalIndex] = useGlobalIndex();
  const [anexoModal, setAnexoModal] = useAnexoModal()
  const [gradeCorrectorModal, setGradeCorrectorModal] = useGradeCorrectorModal()
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

  const handleGradeCorrectorModal = (event) => {

    const gradeCorrectorContainer = document.getElementById("gradeCorrector")


    if (!gradeCorrectorContainer.contains(event.target) && gradeCorrectorModal) {
      setGradeCorrectorModal(false)
    }
}

  return (
    <div className="Home-section" onClick={(event) => {
        handleIndexModal(event)
        handleAnexoModal(event)
        handleImageTextAnaliserModal(event)
        handleGradeCorrectorModal(event)
      }}>
      <Notification />
      <ToPBar />
      <Calendar />
      <Indexes />
      <FileVisualizer />
      <AnexoFile />
      <Dictionary />
      <GradeCorrector />
      <ImageTextAnaliser />
      <EventVisualizerCreator />
      <ClassroomWorkVisualizer />
      <ChangeProfile />
      <Loading />
    </div>
  );
};
