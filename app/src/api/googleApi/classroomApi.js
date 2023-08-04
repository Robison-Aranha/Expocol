import axios from "axios";
import { useClassroomToken } from "../../globalState/globalState";

const http = axios.create({
  baseURL: "https://classroom.googleapis.com/v1"
});


export const useClassroomApi = () => {
  
    const [classroomToken, ] = useClassroomToken()

    const returnCourses = async () => {

      const response = await http.get("/courses?courseStates=ACTIVE", { headers: { Authorization: "Bearer " + classroomToken } })

      return response.data

    }
    
    const returnCourseWork = async (courseId) => {

      const response = await http.get("/courses/" + courseId + "/courseWork?courseWorkStates=PUBLISHED",  { headers: { Authorization: "Bearer " + classroomToken } })


      return response.data
    } 


    return { returnCourses, returnCourseWork }
}