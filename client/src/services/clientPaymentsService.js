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

/* // create client payment
router.post("/", authUser, clientPaymentsValidators.validateCreateClientPayment, validate, clientPaymentsControllers.createClientPayment);

// verify client payment
router.post("/verify", authUser, clientPaymentsValidators.validateVerifyClientPayment, validate, clientPaymentsControllers.verifyClientPayment); */

export const createClientPayment = async (data) => {
    const res = await axiosInstance({
        method: 'POST',
        url: `/client-payments`,
        data
    });
    return res.data;
}

export const verifyClientPayment = async (data) => {
    const res = await axiosInstance({
        method: 'POST',
        url: `/client-payments/verify`,
        data
    });
    return res.data;
}

export const generateInviteLink = async (data) => {
    const res = await axiosInstance({
        method: 'POST',
        url: `/users/generate-invite-link`,
        data
    });
    return res.data;
}

export const getCanInviteDietitian = async () => {
    const res = await axiosInstance({
        method: 'GET',
        url: `/users/can-invite-dietitian`,
    });
    return res.data;
}
