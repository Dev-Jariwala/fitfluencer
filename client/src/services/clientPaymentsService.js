import axiosInstance, { handleApiError } from '../utils/api';

/* // create client payment
router.post("/", authUser, clientPaymentsValidators.validateCreateClientPayment, validate, clientPaymentsControllers.createClientPayment);

// verify client payment
router.post("/verify", authUser, clientPaymentsValidators.validateVerifyClientPayment, validate, clientPaymentsControllers.verifyClientPayment); */

export const createClientPayment = async (data) => {
    try {
        const res = await axiosInstance({
            method: 'POST',
            url: `/client-payments`,
            data
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const verifyClientPayment = async (data) => {
    try {
        const res = await axiosInstance({
            method: 'POST',
            url: `/client-payments/verify`,
            data
        });
        return res.data;
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

export const getCanInviteDietitian = async () => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: `/users/can-invite-dietitian`,
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const getPaymentHistory = async () => {
    try {
        const res = await axiosInstance({
            method: 'GET',
            url: `/client-payments/history`,
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error);
    }
}