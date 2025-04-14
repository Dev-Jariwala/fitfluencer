import axiosInstance, { handleApiError } from '../utils/api';

export const getPlans = async () => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: `/plans`
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

/* export const loginUser = async (data) => {
    const res = await axiosInstance({
        method: 'POST',
        url: `/users/login`,
        data
    });
    return res;
} */