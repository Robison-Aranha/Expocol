import { useGlobalIndex, useGlobalModal, useLoadCalendar, useGlobalLoading } from "../../globalState/globalState";
import { useIndexApi } from "../../api/api";
import { useEffect, useState } from "react";
import "./file-visualizer.style.css";

export const FileVisualizer = () => {
  const [globalIndex, setGlobalIndex] = useGlobalIndex();
  const [,setLoadCalendar] = useLoadCalendar()
  const [file, setFile] = useState();
  const { returnIndex, deleteIndex } = useIndexApi();
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [, setLoading] = useGlobalLoading()

  useEffect(() => {
    if (globalIndex) {
      returnIndexService();
    } else {
      setFile(false);
    }
  }, [globalIndex]);

  const returnIndexService = async () => {
    setLoading(true)
    try {
      const response = await returnIndex(globalIndex);
     
      setFile(response);
    } catch (response) {}
    setLoading(false)
  };

  const deleteIndexService = async () => {
    try {
      await deleteIndex(globalIndex);

      setGlobalModal([
        ...globalModal,
        { message: "Arquivo excluido com sucesso!" },
      ]);
      setLoadCalendar(true)
      setGlobalIndex(false);
    } catch (response) {}
  };

  const returnRenderIndex = () => {
    if (file) {
      if (file.type.includes("video")) {
        return <video src={file?.index} controls className="File-file"></video>;
      } else if (file.type.includes("image")) {
        return <img src={file?.index} className="File-file" />;
      } else if (file.type.includes("application")) {
        return (
          <p className="File-notification">
            {" "}
            Não há suporte para a visualização deste arquivo!{" "}
          </p>
        );
      }
    }
  };

  return (
    <div
      className={"File-section" + (globalIndex ? " modal" : "")}
      id="file-index-section"
    >
      <div className="File-container" id="file-index-container">
        {returnRenderIndex()}
        <div className="File-choice">
          <a href={file?.index} download={file?.indexName} className="button">
            Baixar
          </a>
          <button className="button-black" onClick={deleteIndexService}>
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};
