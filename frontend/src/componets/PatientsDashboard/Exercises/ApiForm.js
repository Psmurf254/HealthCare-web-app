import axios from "axios";

export const exerciseOptions = {
  method: "GET",
  params: {limit: '40'},
  headers: {
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    "X-RapidAPI-Key": 'eb58a1a6d8msh68fce348fa63256p12875djsn20e3e3c5cc92',
  },
};

const BASE_URL = "https://youtube-v31.p.rapidapi.com";

const options = {
  params: {
    maxResults: "8",
  },
  headers: {
    "X-RapidAPI-Key": '58817dd885msh70282614cfb6f9dp197cf6jsn91b408f946be',
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
