import * as plansRepositories from '../repositories/plans.repositories.js';
import { handleError } from '../utils/error.js';

/* -- Plans table
CREATE TABLE plans (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    months INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
); */

export const createPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, points, months, price, offer_price } = req.body;
        const pointsArray = points.join('-points-separator-');
        const plan = await plansRepositories.createPlan({ name, description, points: pointsArray, months, price, offer_price, created_by: userId });
        res.status(201).json({ success: true, message: 'Plan created successfully', data: plan });
    } catch (error) {
        handleError('createPlan', res, error);
    }
};

export const getPlans = async (req, res) => {
    try {
        const plans = await plansRepositories.getPlans();
        const plansWithPoints = plans.map(plan => {
            const pointsArray = plan.points ? plan.points.split('-points-separator-') : [];
            return { ...plan, points: pointsArray };
        });
        res.status(200).json({ success: true, message: 'Plans fetched successfully', data: plansWithPoints });
    } catch (error) {
        handleError('getPlans', res, error);
    }
};

export const getPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await plansRepositories.getPlanById(id);
        const pointsArray = plan.points ? plan.points.split('-points-separator-') : [];
        const planWithPoints = { ...plan, points: pointsArray };
        res.status(200).json({ success: true, message: 'Plan fetched successfully', data: planWithPoints });
    } catch (error) {
        handleError('getPlanById', res, error);
    }
};

export const updatePlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name, description, points, months, price, offer_price, is_active } = req.body;
        const pointsArray = points.join('-points-separator-');
        const plan = await plansRepositories.updatePlan(id, { name, description, points: pointsArray, months, price, offer_price, is_active, updated_by: userId });
        res.status(200).json({ success: true, message: 'Plan updated successfully', data: plan });
    } catch (error) {
        handleError('updatePlan', res, error);
    }
};