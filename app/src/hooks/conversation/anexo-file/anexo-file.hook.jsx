import { useEffect, useState } from "react";
import {
  useAnexoModal,
  useGlobalLoading,
} from "../../../globalState/globalState";
import { useAttachmentApi } from "../../../api/api";
import { useVerifySession } from "../../../api/verifySessions";
import "./anexo-file.style.css";

export const AnexoFile = () => {
  const [anexo, setAnexo] = useState();
  const [anexoModal] = useAnexoModal();
  const [, setLoading] = useGlobalLoading();

  const { returnAttachment } = useAttachmentApi();
  const { verifySessionUser } = useVerifySession()

  useEffect(() => {
    if (anexoModal) {
      returnAttachmentService();
    } else {
      setAnexo(null);
    }
  }, [anexoModal]);

  const returnAttachmentService = async () => {
    setLoading(true);
    try {
      const response = await returnAttachment(anexoModal);

      setAnexo({ ...response });
    } catch (error) {
      verifySessionUser(error);
    }
    setLoading(false);
  };

  const returnRenderAnexo = () => {
    if (anexo) {
      if (anexo.type.includes("video")) {
        return (
          <video src={anexo.anexo} controls className="AnexoFile-file"></video>
        );
      } else if (anexo.type.includes("image")) {
        return <img src={anexo.anexo} className="AnexoFile-file" />;
      } else if (anexo.type.includes("application")) {
        return (
          <p className="AnexoFile-notification">
            {" "}
            Não há suporte para a visualização deste arquivo!{" "}
          </p>
        );
      }
    }
  };

  return (
    <div className={"AnexoFile-section" + (anexoModal ? " modal" : "")}>
      <div className="AnexoFile-container" id="anexo">
        {returnRenderAnexo()}
        <div className="AnexoFile-choice">
          <a href={anexo?.anexo} download={anexo?.anexoName} className="button">
            Baixar
          </a>
        </div>
      </div>
    </div>
  );
};
