import * as commonRepositories from "../repositories/common.repositories.js";
import * as userRepositories from "../repositories/user.repositories.js";
import { handleError } from "../utils/error.js";

export const getChildrensByUserId = async (req, res) => {
    try {
        const userId = req.params.userId === "me" ? req.user.id : req.params.userId;
        console.log(userId);
        const childrens = await commonRepositories.getChildrensByUserId(userId);
        console.log(childrens);
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
