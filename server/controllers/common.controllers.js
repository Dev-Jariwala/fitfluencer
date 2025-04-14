import * as commonRepositories from "../repositories/common.repositories";


export const getChildrensByUserId = async (req, res) => {
    try {
        const userId = req.params.userId === "me" ? req.user.id : req.params.userId;
        const childrens = await commonRepositories.getChildrensByUserId(userId);
        return res.status(200).json({ message: 'Childrens fetched successfully', data: childrens });
    } catch (error) {
        handleError("getChildrensByUserId", res, error);
    }
}

export const getParentByUserId = async (req, res) => {
    try {
        const userId = req.params.userId === "me" ? req.user.id : req.params.userId;
        const parent = await commonRepositories.getParentByUserId(userId);
        return res.status(200).json({ message: 'Parent fetched successfully', data: parent });
    } catch (error) {
        handleError("getParentByUserId", res, error);
    }
}
