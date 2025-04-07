import axios from 'axios';
import toast from 'react-hot-toast';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true,
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    (error) => {
        // Handle errors
        // if (error.response && error.response.status === 429) {
        //     // Display a toast notification for rate-limiting errors
        //     toast.error('Too many requests. Please try again later.');
        // } else if (error.response && error.response.status === 401) {
        //     // Handle 401 errors
        //     toast.error(error.response?.data?.message || 'Unauthorized');
        //     window.location.href = "/login";

        // } else {
        //     // Handle other errors (optional)
        //     // toast.error(error.response?.data?.message || 'An unknown error occurred');
        // }
        return Promise.reject(error);
    }
);

export const getRoles = async () => {
    const res = await axiosInstance({
        method: 'GET',
        url: `/roles`
    });
    return res.data;
}