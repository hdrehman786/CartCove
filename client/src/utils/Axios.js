import axios from "axios";

// export const baseUrl = "https://server-cart-cove.vercel.app";

export const baseUrl = "http://localhost:3000";



const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // ✅ send cookies
});


axiosInstance.interceptors.request.use(
  async (req) => req,
  (error) => Promise.reject(error)
);


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
