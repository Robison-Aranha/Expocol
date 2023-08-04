import { useNavigate } from "react-router-dom";
import { useGlobalModal, useClassroomToken, useClassroomSelectedWork, useClassroomUtils, useGlobalState } from "../globalState/globalState";


export const useVerifySession = () => {

    const [, setClassroomToken] = useClassroomToken()
    const [, setClassroomUtils] = useClassroomUtils()
    const [, setClassroomSelectedWork] = useClassroomSelectedWork()
    const [globalModal, setGlobalModal] = useGlobalModal()
    const navigate = useNavigate()


    const verifySessionUser = (data) => {
        
        if (data.response.status == 401) {
            setTimeout(() => navigate("/", {state: "expired"}), 1000);
        }
    }

    const verifySessionClassroom = (error) => {

        if (error.response.data.error.code == 401) {
            setClassroomToken(null)
            setClassroomUtils({
                courses: null,
                monthWorks: null,
              })
            setClassroomSelectedWork(null)

            setGlobalModal([...globalModal, { message: "Sua sessão no classroom expirou! Logue Novamente!"}])
        }

    }


    return { verifySessionUser, verifySessionClassroom }
}