import * as rolesRepositories from '../repositories/roles.repositories.js';
import { handleError } from '../utils/error.js';

export const createRole = async (req, res) => {
    try {
        const userId = req.user.id;
        const { key, name, description } = req.body;
        const role = await rolesRepositories.createRole({ key, name, description, created_by: userId });
        res.status(201).json({ success: true, message: 'Role created successfully', role });
    } catch (error) {
        handleError('createRole', res, error);
    }
};

export const getRoles = async (req, res) => {
    try {
        const roles = await rolesRepositories.getRoles();
        res.status(200).json({ success: true, message: 'Roles fetched successfully', roles });
    } catch (error) {
        handleError('getRoles', res, error);
    }
};

export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await rolesRepositories.getRoleById(id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        res.status(200).json({ success: true, message: 'Role fetched successfully', role });
    } catch (error) {
        handleError('getRoleById', res, error);
    }
};

export const updateRole = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { key, name, description } = req.body;
        const role = await rolesRepositories.updateRole(id, { key, name, description, updated_by: userId });
        res.status(200).json({ success: true, message: 'Role updated successfully', role });
    } catch (error) {
        handleError('updateRole', res, error);
    }
};



