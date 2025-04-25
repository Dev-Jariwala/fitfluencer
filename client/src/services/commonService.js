import axios from 'axios';
import axiosInstance, { handleApiError } from '../utils/api';

export const getChildrensByUserId = async (userId) => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: `/common/users/${userId}/childrens`,
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
            url: `/common/users/${userId}/parent`,
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}


export const getSignedUrl = async (filePath) => {
    const encodedFilePath = encodeURIComponent(filePath);
    const response = await axiosInstance.get('/common/storage/signed-url?filePath=' + encodedFilePath);
    return response.data;
}

export const getSignedUrlUseingBodyPath = async (info) => {
    const response = await axiosInstance.post('/common/storage/getSignedUrlUseingBodyPath', info);
    return response.data;
}

export const getSignedUrlForUpload = async (info) => {
    const response = await axiosInstance.post('/common/storage/upload/signed-url', info);
    return response.data;
}

export const uploadFileToSignedUrl = async (signedUrl, file) => {
    const response = await axios.put(signedUrl, file);
    return response.data;
};

export const deleteFile = async (data) => {
    const response = await axiosInstance({
        method: 'delete',
        url: '/common/storage/delete',
        data
    });
    return response.data;
}