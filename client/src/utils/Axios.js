// src/utils/axiosInstance.js
import axios from "axios";

export const baseUrl = "https://server-cart-cove.vercel.app";

// const axiosInstance = axios.create({
//   baseURL: baseUrl,
// });

// // Add request interceptor
// axiosInstance.interceptors.request.use(
//   async (req) => {
//     const accessToken = localStorage.getItem("accesstoken");
//     if (accessToken) {
//       req.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return req;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.request.use(
//     async (response) => {
//         return response
//     },
//     async (error) => {
//         let originalRequest = error.config;

//         if(error.response == 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             const refreshtoken = localStorage.getItem("refreshtoken");

//             if(refreshtoken){
//                const response = await refreshaccessToken(refreshtoken);

//                if(response){
//                 originalRequest.headers.Authorization = `Bearer ${response.accesstoken}`;

//                 return originalRequest;
//                }
//             }
//         }

//         return Promise.reject(error);
//     }
// )


// const refreshaccessToken = async(refreshtoken)=>{

//     try {
//         const response = await axios.post(`${baseUrl}/refreshtoken`, {
//             headers : `Bearer ${refreshtoken}`
//         })

//         console.log(response);
//     } catch (error) {
        
//     }
// }

// export default axiosInstance;


const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // ✅ send cookies
});

// No need for Authorization header if using cookies
axiosInstance.interceptors.request.use(
  async (req) => req,
  (error) => Promise.reject(error)
);

// Interceptor for refresh logic (if needed)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshtoken = localStorage.getItem("refreshtoken");

      if (refreshtoken) {
        const response = await refreshaccessToken(refreshtoken);
        if (response?.accesstoken) {
          // Optional: Store new token if you're using header-based
          // localStorage.setItem("accesstoken", response.accesstoken);
          return axiosInstance(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

const refreshaccessToken = async (refreshtoken) => {
  try {
    const response = await axios.post(`${baseUrl}/refreshtoken`, {}, {
      headers: {
        Authorization: `Bearer ${refreshtoken}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Token refresh failed", error);
    return null;
  }
};

export default axiosInstance;
