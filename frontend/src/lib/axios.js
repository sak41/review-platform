import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // browser will send the cookies to the browser automatically on every req
})

export default axiosInstance;


