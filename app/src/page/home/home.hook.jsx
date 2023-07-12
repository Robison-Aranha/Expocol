import { useGlobalIndexModal, useGlobalIndex, useGlobalCalendar } from "../../globalState/globalState"
import { FileVisualizer, ToPBar, Notification, Calendar, Loading, EventVisualizerCreator, Indexes } from "../../hooks/hooks"
import "./home.style.css"


export const Home = () => {

    const [indexGlobalStateModal, setIndexGlobalIndexModal] = useGlobalIndexModal()
    const [, setGlobalCalendar] = useGlobalCalendar()
    const [globalIndex, setGlobalIndex] = useGlobalIndex()

    const handleIndexModal = (event) => {

        const indexContainer = document.getElementById("index")
        const fileSection = document.getElementById("file-index-section")
        const fileContainer = document.getElementById("file-index-container")
        const eventSection = document.getElementById("event")

        if (!indexContainer.contains(event.target) && indexGlobalStateModal && !fileSection.contains(event.target) && !eventSection.contains(event.target)) {
            
            setGlobalCalendar(null)
            setIndexGlobalIndexModal(false)
        }

        if (!fileContainer.contains(event.target) && globalIndex) {
            setGlobalIndex(false)
        }

    }


    return (

        <div className="Home-section" onClick={handleIndexModal}>
            <Notification />
            <ToPBar />
            <Calendar />
            <Indexes />
            <FileVisualizer />
            <Loading />
            <EventVisualizerCreator />
        </div>

    )



}