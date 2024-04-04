
import axios from 'axios';



const BASE_URL = 'https://api-football-beta.p.rapidapi.com';

export const ApiFetch = async (path, params) => {
  const options = {
    method: 'GET',
    url: `${BASE_URL}/${path}`,
    params,
    headers: {
      'X-RapidAPI-Key':  '28f9642eb6msh953833c7dec7458p106456jsn4b60348bcd40',
      'X-RapidAPI-Host': 'api-football-beta.p.rapidapi.com',
    },
  };

  try {
    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


