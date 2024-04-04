import axios from "axios";

export const exerciseOptions = {
  method: "GET",
  params: { limit: "40" },
  headers: {
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    "X-RapidAPI-Key": "58817dd885msh70282614cfb6f9dp197cf6jsn91b408f946be",
  },
};

const BASE_URL = "https://youtube-v31.p.rapidapi.com";

const options = {
  params: {
    maxResults: "6",
  },
  headers: {
    "X-RapidAPI-Key": "58817dd885msh70282614cfb6f9dp197cf6jsn91b408f946be",
    "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
  },
};

export const fetchFromAPI = async (path) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${path}`, options);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchData = async (url, options) => {
  const res = await fetch(url, options);
  const data = await res.json();

  return data;
};
