import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/usuario",
    withCredentials: true
})

const FINAL_SIZE = 5;


export const useUsersApi = () => {


    const listUser = async (nome, page) => {


        const response = await http.get("/search?nome=" + nome + "&page=" + page + "&size=" + FINAL_SIZE)


        return response.data

    }

    const detailUser = async () => {

        const response = await http.get()


        return response.data

    }

    return { listUser, detailUser }

}
