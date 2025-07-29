// api.ts
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("baseURL",baseURL)
const axiosApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosApi.defaults.headers.common['Authorization'];
  }
};

export default axiosApi;
