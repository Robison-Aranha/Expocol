import { useEffect } from "react"
import { useGradeCorrectorModal } from "../../globalState/globalState"
import "./grade-corrector.style.css"






export const GradeCorrector = () => {

    const [grandeCorrectorModal, setGradeCorrectorModal] = useGradeCorrectorModal()

    


    return (

    
        <div className={"GradeCorrector-section" + (grandeCorrectorModal ? " modal" : "")}>
            <div className="GradeCorrector-container" id="gradeCorrector">



            </div>
        </div>
        

    )

}