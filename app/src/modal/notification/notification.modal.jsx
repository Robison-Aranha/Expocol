import { useState, useEffect } from "react"
import { useGlobalModal } from "../../globalState/globalState"
import "./notification.style.css"

export const Notification = () => {

    const [timer, setTimer] = useState(0)
    const [timePassed, setTimePassed] = useState(0)
    const [globalModal, setGlobalModal] = useGlobalModal()


    useEffect(() => {

        setTimer(globalModal.length * 1)

    }, [globalModal])

    useEffect(() => {

        setTimeout(() => { 
            
            setTimePassed(timePassed + 1)

        } , 1000) 
        
    }, [timer])


    useEffect(() => {

        console.log("batata")
        setGlobalModal([...globalModal.slice(1, globalModal.length)])

    }, [timePassed])


    return (
        <>
            { globalModal.length > 0 ? globalModal.map((notification, index) =>
                <div className="Modal-section" style={{ display : ( globalModal.length > 0 ? "flex" : "none" ), "backgroundColor" : notification.color }} key={index}>
                    <p> {notification.message} </p>
                </div>
            ): null}
       </>
    )

}