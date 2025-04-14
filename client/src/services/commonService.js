import axiosInstance, { handleApiError } from '../utils/api';

export const getChildrensByUserId = async (userId) => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: `/users/${userId}/childrens`,
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const getParentByUserId = async (userId) => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: `/users/${userId}/parent`,
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}


