import axios from "axios";

const http = axios.create({
  baseURL: "https://api.dicionario-aberto.net/"
});

export const useDictionaryApi = () => {
  const searchWord = async (word) => {

    const response = {search: "", near: ""}

    const search = await http.get("word/" + word);
    const near = await http.get("near/" + word);

    response.search = search.data
    response.near = near.data

    return response;
  };

  return { searchWord };
};
