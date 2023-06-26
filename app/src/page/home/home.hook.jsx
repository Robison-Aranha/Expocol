import { useGlobalIndexModal, useGlobalIndex } from "../../globalState/globalState"
import { FileVisualizer, ToPBar, Notification, Calendar, Loading } from "../../hooks/hooks"
import "./home.style.css"


export const Home = () => {

    const [indexGlobalStateModal, setIndexGlobalIndexModal] = useGlobalIndexModal()
    const [globalIndex, setGlobalIndex] = useGlobalIndex()

    const handleIndexModal = (event) => {

        const index = document.getElementById("index")
        const fileSection = document.getElementById("file-index-section")
        const fileContainer = document.getElementById("file-index-container")

        if (!index.contains(event.target) && indexGlobalStateModal && !fileSection.contains(event.target)) {
            
            index.style.transform = "translatex(100%)"
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
            <FileVisualizer />
            <Loading />
        </div>

    )



}