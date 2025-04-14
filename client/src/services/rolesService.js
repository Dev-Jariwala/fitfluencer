import axiosInstance, { handleApiError } from '../utils/api';

export const getRoles = async () => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: `/roles`
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}