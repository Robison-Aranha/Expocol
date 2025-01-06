import {
  useGlobalState,
  useGlobalChangeProfile,
  useGlobalModal,
} from "../../globalState/globalState";
import dafaultImgAccount from "../../assets/account/default.png";
import { useUsersApi } from "../../api/api";
import { useState } from "react";
import "./change-profile.style.css";
import { MAX_FILE } from "../../consts/FileMax.js";
import { verifyFile } from "../../scripts/verifyImage";
import { useVerifySession } from "../../api/verifySessions";

export const ChangeProfile = () => {
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    file: null,
  });
  const [imagePreview, setImagePreview] = useState();
  const [userGlobalState, setUserGlobalState] = useGlobalState();
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [globalChangeProfile, setGlobalChangeProfile] =
    useGlobalChangeProfile();

  const { updateCredentialsUser, updateImageUser } = useUsersApi();
  const { verifySessionUser } = useVerifySession();
  const { isImg } = verifyFile();

  const updateUserService = async () => {
    if (verifyCredentials()) {
      try {
        if (userData.email != "" || userData.nome != "") {
          await updateCredentialsUser(userData.nome, userData.email);

          if (userData.nome != "") {
            userGlobalState.nome = userData.nome;
          }

          if (userData.email != "") {
            userGlobalState.email = userData.email;
          }

          setUserGlobalState({ ...userGlobalState });
          globalModal.push({
            message: "Crendenciais atualizadas com sucesso!!",
          });
        }
      } catch (error) {
        verifySessionUser(error);
        if (
          error.response.status == 406 ||
          error.response.status == 409 ||
          error.response.status == 302
        ) {
          globalModal.push({ message: error.response.data.message });
        }
      }

      try {
        if (userData.file) {
          await updateImageUser(userData.file);

          globalModal.push({ message: "Imagem atualizada com sucesso!!" });
          setUserGlobalState({
            ...userGlobalState,
            imagem: URL.createObjectURL(imagePreview),
          });
        }
      } catch (error) {
        verifySessionUser(error);
      }
      setGlobalModal([...globalModal]);
    }
    setUserData({ ...userData, nome: "", email: "", file: null });
  };

  const verifyCredentials = () => {
    if (userData.nome == "" && userData.email == "" && userData.file == null) {
      setGlobalModal([
        ...globalModal,
        { message: "Nenhuma alteração feita!!" },
      ]);
      return false;
    }

    return true;
  };

  const handlerFile = (event) => {
    const file = event.target.files[0];

    if (isImg(file)) {
      if (file.size <= MAX_FILE) {
        const formData = new FormData();

        formData.append("file", file);

        setImagePreview(file);

        setUserData({ ...userData, file: formData });
      } else {
        setGlobalModal([
          ...globalModal,
          { message: "Arquivo excedeu o limite de donwload!!" },
        ]);
      }
    } else {
      setGlobalModal([
        ...globalModal,
        { message: "O arquivo selecionado não é uma imagem!!" },
      ]);
    }
  };

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const returnImageUser = () => {
    if (imagePreview) {
      return URL.createObjectURL(imagePreview);
    } else if (userGlobalState.imagem) {
      return userGlobalState.imagem;
    } else {
      return dafaultImgAccount;
    }
  };

  return (
    <div
      className={
        "ChangeProfile-section" + (globalChangeProfile ? " modal" : "")
      }
    >
      <div className="ChangeProfile-container">
        <div className="ChangeProfile-exit">
          <button
            className="button-black button-small"
            onClick={() => setGlobalChangeProfile(false)}
          >
            X
          </button>
        </div>
        <div className="ChangeProfile-content">
          <div className="ChangeProfile-item-img">
            <label className="ChangeProfile-img" htmlFor="file-change-profile">
              <input
                type="file"
                name="file"
                id="file-change-profile"
                accept="image/*"
                className="ChangeProfile-input-file"
                onChange={handlerFile}
              />
              <img src={returnImageUser()} />
            </label>
            <p> 30MB permitido para upload... </p>
          </div>
          <div className="ChangeProfile-item">
            <label> Nome: </label>
            <input
              placeholder={
                userGlobalState.nome + " -- 6 a 12 / apenas letras e numeros..."
              }
              onChange={handlerValue}
              value={userData.nome}
              name="nome"
            />
          </div>
          <div className="ChangeProfile-item">
            <label> Email: </label>
            <input
              placeholder={userGlobalState.email}
              onChange={handlerValue}
              name="email"
              value={userData.email}
            />
          </div>
          <div className="ChangeProfile-choice">
            <button onClick={updateUserService}>Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
};
