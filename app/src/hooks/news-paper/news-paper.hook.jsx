import {
  useNewsPaperModal,
  useGlobalModal,
  useGlobalLoading
} from "../../globalState/globalState";
import { useNewsPaperApi } from "../../api/api";
import "./news-paper.style.css";
import { useEffect, useState } from "react";
import {
    LocalDateTime,
    ZonedDateTime,
    DateTimeFormatter
  } from "@js-joda/core";

export const NewsPaper = () => {
  const [userData, setUserData] = useState({
    search: "",
  });
  const [newsPaperModal, setNewsPaperModal] = useNewsPaperModal();
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [, setLoading] = useGlobalLoading()
  const [selectedNew, setSelectedNew] = useState()
  const [state, setState] = useState(false)

  const [news, setNews] = useState([]);

  const { returnActualNewsBrasil, searchNews } = useNewsPaperApi();


  useEffect(() => {


    if (!newsPaperModal) {
        setSelectedNew(null)
        setUserData({ search: ""})
        setState(false)
        setNews([])
    }


  }, [newsPaperModal])


  const searchNewsService = async () => {
    setLoading(true)
    try {
      const response = await searchNews(userData.search);

      setNews([...response.articles]);
    } catch {
      setGlobalModal([
        ...globalModal,
        { message: "Erro ao retornar noticias! Tente Novamente mais tarde!" },
      ]);
    }
    setLoading(false)
  };

  const returnActualNewsBrasilService = async () => {
    setLoading(true)
    try {
      const response = await returnActualNewsBrasil();

      setNews([...response.articles]);
    } catch {
      setGlobalModal([
        ...globalModal,
        {
          message:
            "Erro ao retornar ultimas noticias! Tente novamente mais tarde!",
        },
      ]);
    }
    setLoading(false)
  };

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className={"NewsPaper-section" + (newsPaperModal ? " modal" : "")}>
      <div className="NewsPaper-container">
        <div className="NewsPaper-header">
          <h2 className="NewsPaper-title">
            <strong> Notícias </strong>
          </h2>
          <button
            className="NewsPaper-exit-button button-black button-small"
            onClick={() => setNewsPaperModal(false)}
          >
            X
          </button>
        </div>
        <div className="NewsPaper-content">

            { !state ?

                <>
                <div className="NewsPaper-search-box">
                    <input
                    type="text"
                    onChange={handlerValue}
                    name="search"
                    value={userData.search}
                    />
                    <button onClick={searchNewsService}>Pesquisar</button>
                    <blockquote>
                    <button className="button-outline" onClick={returnActualNewsBrasilService}>
                        Top noticias Brasil
                    </button>
                    </blockquote>
                </div>
                <div className="NewsPaper-result">
                    {news.map((article, key) => (
                        <div className="NewsPaper-result-item" onClick={() => { 
                            setSelectedNew(article)
                            setState(true)

                            } } key={key}>
                            <p> <strong> { article.author ? article.author : article.source.name } </strong> : { article.title } </p>
                        </div>
                    ))}
                </div>
                </>

            :
            <div className="NewsPaper-selected-new">
                <div className="NewsPaper-selected-new-title">
                    <h4> <strong> { selectedNew.title ? selectedNew.title : "Nenhum titulo especificado..." } </strong> </h4>
                </div>
                <div className="NewsPaper-article-header">
                    <p> <strong> Data de publicação: </strong> { ZonedDateTime.parse(selectedNew.publishedAt).format(
                    DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) } </p>
                    <img src={selectedNew.urlToImage} alt="No Image..."/>
                </div>
                <div className="NewsPaper-article-content">
                    <div className="NewsPaper-article-item">
                        <label> <stron> Autor: </stron> </label>
                        <blockquote> { selectedNew.author ? selectedNew.author : "Nenhum autor referido..." } </blockquote>
                    </div>
                    <div className="NewsPaper-article-item">
                        <label> <stron> Descrição: </stron> </label>
                        <blockquote> { selectedNew.description ? selectedNew.description : "Nenhuma descrição referida..." } </blockquote>
                    </div>
                    <div className="NewsPaper-article-item">
                        <label> <stron> Link: </stron> </label>
                        <blockquote> <a href={ selectedNew.url }> {selectedNew.url} </a> </blockquote>
                    </div>
                </div>
                <button className="button-small button-clear" onClick={() => {
                    setSelectedNew(null)
                    setState(false)
                }}> ...voltar </button>
            </div>
            }
        </div>
      </div>
    </div>
  );
};
