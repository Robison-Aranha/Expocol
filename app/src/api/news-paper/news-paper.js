import axios from "axios";
import { NEWS_API_KEY } from "../../consts/NewsApiKey";

const http = axios.create({
  baseURL: "https://newsapi.org/v2",
});

export const useNewsPaperApi = () => {
  const returnActualNewsBrasil = async () => {
    const response = await http.get(
      "/top-headlines?sources=google-news-br&apiKey=" + NEWS_API_KEY
    );

    return response.data;
  };

  const searchNews = async (search) => {
    const response = await http.get(
      "/everything?q=" + search + "&apiKey=" + NEWS_API_KEY
    );

    return response.data;
  };

  return { returnActualNewsBrasil, searchNews };
};
