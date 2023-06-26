import { useGlobalLoading } from "../../globalState/globalState"
import "./loading.style.css"



export const Loading = () => {

    const [loading, ] = useGlobalLoading()


    return (
        <div className={"Loading-section" + (loading ? " modal" : "")}>
            <div className="Loading-loader"></div>
        </div>

    )

}