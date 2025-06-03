import axiosInstance, { handleApiError } from '../utils/api';

export const getMeals = async () => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: '/meals',
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const createMeal = async (data) => {
    try {
        const res = await axiosInstance({
            method: 'POST',
            url: '/meals',
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const updateMeal = async (id, data) => {
    try {
        const res = await axiosInstance({
            method: 'PUT',
            url: `/meals/${id}`,
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const deleteMeal = async (id) => {
    try {
        const res = await axiosInstance({
            method: 'DELETE',
            url: `/meals/${id}`,
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

