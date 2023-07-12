import { useState, useEffect, useMemo } from "react";
import { useGlobalModal } from "../../globalState/globalState";
import "./notification.style.css";

export const Notification = () => {
  const [timer, setTimer] = useState(false)
  const [timePassed, setTimePassed] = useState(false);
  const [stop, setStop] = useState(false)
  const [globalModal, setGlobalModal] = useGlobalModal();

  useEffect(() => {

    if (!stop) {

      setTimeout(() => {
        setTimePassed(!timePassed);
        console.log("deletou")
      }, 2000);
    }
    
  }, [timer]);

  useEffect(() => {
   
    setGlobalModal([...globalModal.slice(1, globalModal.length)]);

    verifyStop()
    
  }, [timePassed]);

  useEffect(() => {

    verifyStop()

    setTimer(!timer)

  }, [globalModal])

  const verifyStop = () => {

    if (globalModal.length == 0) {
      setStop(true)
    } else {
      setStop(false)
    }

  }

  return (
    <>
      {globalModal.length > 0
        ? globalModal.map((notification, index) => (
            <div
              className="Modal-section column"
              style={{
                display: globalModal.length > 0 ? "flex" : "none"
              }}
              key={index}
            >
              <p><strong> {notification.message} </strong></p>
            </div>
          ))
        : null}
    </>
  );
};