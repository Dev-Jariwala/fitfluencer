// controllers/config.controllers.js
import * as configRepositories from '../repositories/config.repositories.js';
import { handleError } from '../utils/error.js';

export const createConfig = async (req, res) => {
    try {
        const userId = req.user.id;
        const { key, type, name, value } = req.body;
        const config = await configRepositories.createConfig({ key, type, name, value, created_by: userId });
        res.status(201).json(config);
    } catch (error) {
        handleError('createConfig', res, error);
    }
};

export const getConfigs = async (req, res) => {
    try {
        const configs = await configRepositories.getConfigs();
        res.status(200).json(configs);
    } catch (error) {
        handleError('getConfigs', res, error);
    }
};

export const getConfigByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const config = await configRepositories.getConfigByKey(key);
        res.status(200).json(config);
    } catch (error) {
        handleError('getConfigByKey', res, error);
    }
};

export const getConfigById = async (req, res) => {
    try {
        const { id } = req.params;
        const config = await configRepositories.getConfigById(id);
        res.status(200).json(config);
    } catch (error) {
        handleError('getConfigById', res, error);
    }
};

export const updateConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const { key, type, name, value } = req.body;
        const config = await configRepositories.updateConfig(id, { key, type, name, value });
        res.status(200).json(config);
    } catch (error) {
        handleError('updateConfig', res, error);
    }
};