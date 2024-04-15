import axios from "axios";

const service = axios.create({
   baseURL: import.meta.env.VITE_SERVER_URL
    // baseURL: "http://localhost:5005/api"
    // baseURL: "https://0fx8fxsp-5005.uks1.devtunnels.ms/api"
})

service.interceptors.request.use((config)=>{
    const storedToken = localStorage.getItem("authToken")
    if(storedToken){
        config.headers.Authorization = `Bearer ${storedToken}`
    }
    return config
})

export default service