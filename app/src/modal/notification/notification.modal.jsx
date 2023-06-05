import { useState, useEffect } from "react"


export const Notification = (props) => {

    const [timer, setTimer] = useState(5)


    useEffect(() => {

        setInterval(() => setTimer(timer - 1), 1000)

        if (timer == 0) {
            document.getElementsByClassName("Modal-section").remove();
        }

    }, [timer])


    return (
        <div className="Modal-section" style={{ "backgroundColor" : props.color }}>
            <p> {props.notification} </p>
        </div>
    )

}