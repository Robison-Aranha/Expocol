import {
  useDicionaryModal,
  useGlobalModal,
  useGlobalLoading,
} from "../../globalState/globalState";
import { useDictionaryApi } from "../../api/api";
import "./dictionary.style.css";
import { useEffect, useState } from "react";

export const Dictionary = () => {
  const [userData, setUserData] = useState({
    search: "",
  });
  const [result, setResult] = useState({ search: null, near: [] });

  const [globalModal, setGlobalModal] = useGlobalModal();
  const [, setLoading] = useGlobalLoading();
  const [dictionaryModal, setDictionaryModal] = useDicionaryModal();

  const { searchWord } = useDictionaryApi();

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    if (!dictionaryModal) {
      setResult({ search: null, near: [] });
      setUserData({ search: "" });
    }
  }, [dictionaryModal]);

  const searchWordService = async () => {
    setLoading(true);
    try {
      const response = await searchWord(userData.search);

      if (response.search.length > 0) {
        const xml = new DOMParser().parseFromString(
          response.search[0].xml,
          "text/xml"
        );

        result.search = xml.childNodes[0].textContent;
      } else {
        result.search = "Palavra não encontrada!";
      }

      result.near = response.near;

      setResult({ ...result });
    } catch (error) {
      setGlobalModal([
        ...globalModal,
        { message: "Ocorreu um erro ao pesquisar!" },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className={"Dictionary-section" + (dictionaryModal ? " modal" : "")}>
      <div className="Dictionary-container">
        <div className="Dictionary-header">
          <h2 className="Dictionary-title">
            <strong> Dicionário </strong>
          </h2>
          <button
            className="Dictionary-exit-button button-black button-small"
            onClick={() => setDictionaryModal(false)}
          >
            X
          </button>
        </div>
        <div className="Dictionary-content">
          <div className="Dictionary-search-box">
            <input
              type="text"
              onChange={handlerValue}
              name="search"
              value={userData.search}
            />
            <button onClick={searchWordService}>Pesquisar</button>
          </div>
          <div className="Dictionary-result">
            <div className="Dictionary-result-search">
              <p>
                {" "}
                <strong> Significado: </strong>{" "}
              </p>
            <blockquote>
                {result.search}
            </blockquote>
            </div>
            <div className="Dictionary-result-search">
              <p>
                {" "}
                <strong> Palavras Próximas: </strong>{" "}
              </p>
                <blockquote>
                    { result.near.map((word, key) => <p key={key}> {word} </p>) }
                </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
