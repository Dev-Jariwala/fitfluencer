import * as commissionRepositories from '../repositories/commission.repositories.js';
import { handleError } from '../utils/error.js';

/* -- Commission table
CREATE TABLE commission (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    type VARCHAR(50) CHECK (type IN ('dietitian', 'corporate_client')),
    max_downline INT NOT NULL,  -- This will allow us to track the number of downlines
    level INT NOT NULL CHECK (level BETWEEN 0 AND max_downline),  -- 1 for first-layer, 2 for second-layer, etc.
    role_id UUID NOT NULL REFERENCES roles(id),
    commission_percentage DECIMAL(5,2) NOT NULL CHECK (commission_percentage BETWEEN 0 AND 100),  -- Percentage for commission
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (type,max_downline, level, role_id)
); */


export const createCommission = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, max_downline, commissions = [] } = req.body;

        const commissionData = await Promise.all(commissions.map(async (commission) => {
            const { level, commission_percentage, role_id } = commission;
            const commissionData = await commissionRepositories.createCommission({ type, max_downline, level, role_id, commission_percentage });
            return commissionData;
        }));
        res.status(201).json(commissionData);
    } catch (error) {
        handleError('createCommission', res, error);
    }
};

export const getCommissions = async (req, res) => {
    try {
        const commissions = await commissionRepositories.getCommissions();
        res.status(200).json(commissions);
    } catch (error) {
        handleError('getCommissions', res, error);
    }
};

export const getCommissionByKeys = async (req, res) => {
    try {
        const { type, max_downline } = req.query;
        const commission = await commissionRepositories.getCommissionByKeys(type, max_downline);
        res.status(200).json(commission);
    } catch (error) {
        handleError('getCommission', res, error);
    }
};

export const updateCommission = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, max_downline, commissions = [] } = req.body;
        const commissionData = await Promise.all(commissions.map(async (commission) => {
            const { level, commission_percentage, role_id } = commission;
            const commissionData = await commissionRepositories.updateCommission(id, { type, max_downline, level, role_id, commission_percentage });
            return commissionData;
        }));
        res.status(200).json(commissionData);
    } catch (error) {
        handleError('updateCommission', res, error);
    }
};