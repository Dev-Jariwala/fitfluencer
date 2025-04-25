import * as commonRepositories from "../repositories/common.repositories.js";
import * as userRepositories from "../repositories/user.repositories.js";
import { handleError } from "../utils/error.js";
import { deleteObject, generateSignedUrl, generateUploadSignedUrl } from "../services/storage/index.js";

const bucketName = process.env.MINIO_BUCKET_NAME;

export const getChildrensByUserId = async (req, res) => {
    try {
        const userId = req.params.userId === "me" ? req.user.id : req.params.userId;
        const childrens = await commonRepositories.getChildrensByUserId(userId);
        return res.status(200).json({ success: true, message: 'Childrens fetched successfully', data: childrens });
    } catch (error) {
        handleError("getChildrensByUserId", res, error);
    }
}

export const getParentByUserId = async (req, res) => {
    try {
        const userId = req.params.userId === "me" ? req.user.id : req.params.userId;
        const user = await userRepositories.getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: null });
        }
        const parent = await commonRepositories.getParentByUserId(user.parent_id);
        return res.status(200).json({ success: true, message: 'Parent fetched successfully', data: parent });
    } catch (error) {
        handleError("getParentByUserId", res, error);
    }
}

export const getSignedUrl = async (req, res) => {
    try {
        const { filePath } = req.query;
        const signedUrl = await generateSignedUrl(bucketName, filePath);
        res.status(200).json({ message: 'Fetched successfully', signedUrl });
    } catch (error) {
        console.log("getSignedUrl catch = ", error);
        res.status(500).json({ message: "Something went wrong from the database", error: error?.message });
    }
}

export const getSignedUrlUseingBodyPath = async (req, res) => {
    try {
        const { filePath } = req.body;
        const signedUrl = await generateSignedUrl(bucketName, filePath, 120);

        res.status(200).json({ message: 'Fetched successfully', signedUrl });
    } catch (error) {
        console.log("getSignedUrl catch = ", error);
        res.status(500).json({ message: "Something went wrong from the database", error: error?.message });
    }
}

export const getSignedUrlForUpload = async (req, res) => {
    try {
        const { filePath } = req.body;
        console.log("filePath", filePath)
        const signedUrl = await generateUploadSignedUrl(bucketName, filePath, 120);
        res.status(200).json({ message: 'Fetched successfully', signedUrl });
    } catch (error) {
        console.log("getSignedUrlForUpload catch = ", error);
        res.status(500).json({ message: "Something went wrong from the database", error: error?.message });
    }
}

export const deleteFile = async (req, res) => {
    try {
        const { filePath } = req.body;
        await deleteObject(bucketName, filePath);
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        console.log("deleteFile catch = ", error);
        res.status(500).json({ message: "Something went wrong from the database", error: error?.message });
    }
}