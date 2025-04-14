import axiosInstance, { handleApiError } from '../utils/api';

export const authenticateUser = async () => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: `/users/authenticate`
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const loginUser = async (data) => {
    try {
        const res = await axiosInstance({
            method: 'POST',
            url: `/users/login`,
            data
        });
        return res;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const logoutUser = async () => {
    try {
        const res = await axiosInstance({
            method: 'POST',
            url: `/users/logout`
        });
        return res;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const generateInviteLink = async (data) => {
    try {
        const res = await axiosInstance({
            method: 'POST',
            url: `/users/generate-invite-link`,
            data
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const verifyInviteLink = async (data) => {
    try {
        const res = await axiosInstance({
            method: 'POST',
            url: `/users/verify-invite-link`,
            data
        });
        return res;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const registerUser = async (data) => {
    try {
        const res = await axiosInstance({
            method: 'POST',
            url: `/users/register`,
            data
        });
        return res;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const getUserById = async (userId) => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: `/users/${userId}`,
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const getRoles = async () => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: '/roles',
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const getInviteLinksHistory = async () => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: '/users/invite-links-history',
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const getMyFamilyTree = async () => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: '/users/family-tree',
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}
