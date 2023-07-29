import "./image-text-analiser.style.css"
import { useImageTextAnaliserModal, useGlobalLoading, useGlobalModal } from "../../globalState/globalState"
import { useVideo } from "../../scripts/useVideo"
import { useEffect, useState } from "react"
import { useToolsApi } from "../../api/api"
import { verifyFile } from "../../scripts/verifyImage"
import { MAX_FILE } from "../../consts/FileMax"



export const ImageTextAnaliser = () => {

    const [ImageTextAnaliser, setImageTextAnaliser] = useImageTextAnaliserModal()
    const [globalModal, setGlobalModal] = useGlobalModal()
    const [state, setState] = useState()
    const [fileSwitch, setFileSwitch] = useState(1)
    const [imagePreview, setImagePreview] = useState()
    const [result, setResult] = useState()
    const [, setLoading] = useGlobalLoading()

    const { startVideo, takePicture } = useVideo()
    const { analiseImageText  } = useToolsApi()
    const { isImg } = verifyFile()


    useEffect(() => {


        if (ImageTextAnaliser && !imagePreview && fileSwitch == 3) {
            startVideo("video-imageTextAnaliser", () => setImageTextAnaliser(false))
        } else if (!ImageTextAnaliser) {
            setFileSwitch(1)
            setImagePreview(false)
            setState(false)
        }

    }, [ImageTextAnaliser, imagePreview, fileSwitch])

    useEffect(() => {

        if (fileSwitch == 3 || !ImageTextAnaliser) {

            const container = document.getElementById("imageTextAnaliser")

            container.style.animationName = ""
        }


    }, [fileSwitch, ImageTextAnaliser])


    const analiseImageTextService = async () => {

        setLoading(true)
        

        if (imagePreview.size <= MAX_FILE) {

            try {
                const formData = new FormData();

                formData.append("file", imagePreview);

                const response = await analiseImageText(formData)

                setResult(response.textoEncontrado)

                setState(true)

            } catch (error) {
                console.log(error)
            }
        } else {
            setGlobalModal([...globalModal, { message: "Arquivo excedeu o limite de upload!!" }])
        }

        setLoading(false)
    }


    const handlerFile = (event) => {

        const file = event.target.files[0];

        if (isImg(file)) {

            setImagePreview(file)
            setFileSwitch(2)

        } else {
            setGlobalModal([...globalModal, { message: "O arquivo escolhido não é uma imagem!!"}])
        }
    }


    const returnAction = () => {

        if (fileSwitch == 1) {
           return (
            <div className="ImageTextAnaliser-action">
                <h3> OCR : Reconhecimento Ótico de Caracteres </h3>
                <button onClick={() => setFileSwitch(3)}>
                    Camera
                </button>
                <input
                    type="file"
                    name="file"
                    id="file-imageTextAnaliser"
                    className="ImageTextAnaliser-input-file"
                    accept="image/*"
                    onChange={handlerFile}
                />
                <label className="button" htmlFor="file-imageTextAnaliser">
                    Escolha uma foto
                </label>
            </div>
           )
        } else if (fileSwitch == 3 && !imagePreview) {
            return (
                <video id="video-imageTextAnaliser" autoPlay />
            )
        }

    }


    const returnActionImage = () => {

        if (fileSwitch != 1) {

            if (!imagePreview && fileSwitch == 3) { 
                return (
                    <>
                        <button className="button-black button-clear" onClick={() => setFileSwitch(1)}>
                            ...voltar
                        </button>
                        <button onClick={() => setImagePreview(takePicture("video-imageTextAnaliser"))}>
                            Tirar Foto
                        </button> 
                    </>
                )
            } else {
                return (
                    <>
                        <button className="button-black button-clear" onClick={() => {
                            setFileSwitch(1)
                            setImagePreview(false) 
                            }}>
                            ...voltar
                        </button>
                        <button onClick={analiseImageTextService} >
                            Proseguir
                        </button>
                    </>
                )
            } 
        } 
    }


    const returnState = () => {

        if (!state) {
            return (
                <>
                    {returnAction()}  
                    {imagePreview && fileSwitch != 1 ? <img id="imagePreview" src={URL.createObjectURL(imagePreview)} /> : null}
                    { fileSwitch != 1 ? 
                        <div className="ImageTextAnaliser-take-picture">
                            {returnActionImage()}
                        </div>
                    : null    
                    }
                </>
            )
        } else {
            return (
                <div className="ImageTextAnaliser-result">
                    <div className="ImageTextAnaliser-result-content">
                        <blockquote>
                            {result}
                        </blockquote>
                    </div>
                    <div className="ImageTextAnaliser-result-content-action">
                        <button className="button-black button-clear" onClick={() => {
                            setFileSwitch(1)
                            setImagePreview(false)
                            setState(false)
                            setResult(false)
                        }}>
                            ..voltar
                        </button>
                    </div>
                </div>
            )
        }


    }


    return (
        <div className={"ImageTextAnaliser-section" + (ImageTextAnaliser ? " modal" : "")}>
           <div className="ImageTextAnaliser-container" id="imageTextAnaliser">
            {returnState()}
           </div>
        </div>
    )



}