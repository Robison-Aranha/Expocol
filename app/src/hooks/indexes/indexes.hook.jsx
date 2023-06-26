import { useEffect, useState } from "react";
import { useCalendarApi } from "../../api/api";
import "./indexes.style.css"
import { useGlobalModal, useGlobalIndexModal, useGlobalIndex } from "../../globalState/globalState";


export const Indexes = (props) => {
  const [files, setFiles] = useState([]);
  const [events, setEvents] = useState([]);
  const [indexGlobalState, ] = useGlobalIndexModal()
  const [globalModal, setGlobalModal] = useGlobalModal()
  const [globalIndex, setGlobalIndex] = useGlobalIndex()

  const { returnIndexes, addIndex } = useCalendarApi();

  useEffect(() => { 
   
    if (indexGlobalState) {
      
      const indexSection = document.getElementById("index")
     
      indexSection.style.transform = "translatex(0)";

      returnIndexesService()
    }
  
  }, [indexGlobalState])

  useEffect(() => {

    returnIndexesService()

  }, [globalIndex])

  const returnIndexesService = async () => {
    try {
      const response = await returnIndexes(
        props.year,
        props.month,
        props.day
      );

      console.log(response)

      setFiles([ ...response.indexes ]);
    } catch (response) {}
  };

  const addIndexService = async (event) => {
    try  {
      
      const formData = new FormData()

      formData.append("file", event.target.files[0])

      await addIndex(props.year, props.month, props.day, formData)

      event.target.value = ""
    
      returnIndexesService()
      setGlobalModal([...globalModal, { message: "Arquivo adicionado com sucesso!", color: "green" }])
    } catch (error) {
      console.log(error)
      setGlobalModal([...globalModal, { message: error.response.data.message }])

      event.target.value = ""
   
    }

  }

  return (
    <div className="Indexes-section" id="index">
      <div className="Indexes-files">
        <h1> Arquivos </h1>
        <p> Os arquivos devem ter um maximo de 25 caracteres em seus titulos!</p>
        <div className="Indexes-files-content">
          {files.length > 0 ? files.map((file, index) => (

            <div className="Indexes-file button button-outline" onClick={() => setGlobalIndex(file.id)} key={index}>
              <p>{file.indexName}</p>
            </div>

          )) : <p> Não há arquivos anexados ainda... </p>}
        </div>
      </div>
      <div className="Indexes-events">
      <h1> Eventos </h1>
        <div>

        </div>
      </div>
      <div className="Indexes-choice">
        <input type="file" name="file" id="file" className="Indexes-input-file" onChange={addIndexService}/>
        <label className="button" htmlFor="file" >Choose a file</label>
        <button> Adicionar evento </button>
      </div>
    </div>
  );
};
