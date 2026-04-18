import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

let interceptorSet = false;

export function setAuthInterceptor(getToken) {
    if (interceptorSet) return; // avoid duplicate interceptors
    interceptorSet = true;

    axiosInstance.interceptors.request.use(async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
}

export default axiosInstance;
