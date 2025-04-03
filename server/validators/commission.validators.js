import { body, param, query } from "express-validator";
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

/* export const createCommission = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, max_downline, commissions = [] } = req.body;

        const commissionData = await Promise.all(commissions.map(async (commission) => {
            const { level, commission_percentage } = commission;
            const commissionData = await commissionRepositories.createCommission({ type, max_downline, level, role_id: userId, commission_percentage });
            return commissionData;
        }));
        res.status(201).json(commissionData);
    } catch (error) {
        handleError('createCommission', res, error);
    }
}; */

export const validateCreateCommission = [
    body('type').notEmpty().withMessage('Type is required').isIn(['dietitian', 'corporate_client']).withMessage('Invalid type'),
    body('max_downline').notEmpty().withMessage('Max downline is required').isInt({ min: 0 }).withMessage('Max downline must be at least 0'),
    body('commissions').notEmpty().withMessage('Commissions are required').isArray().withMessage('Commissions must be an array')
        .custom((commissions, { req }) => {
            const maxDownline = req.body.max_downline;

            // Check if commissions array has at least max_downline + 1 elements
            if (commissions.length < maxDownline + 1) {
                throw new Error(`Commissions array must have at least ${maxDownline + 1} elements`);
            }

            // Check if levels are unique and within range
            const levels = commissions.map(c => c.level);
            const uniqueLevels = new Set(levels);

            if (uniqueLevels.size !== commissions.length) {
                throw new Error('Each commission level must be unique');
            }

            // Check if levels are within range (0 to max_downline)
            for (const level of levels) {
                if (level < 0 || level > maxDownline) {
                    throw new Error(`Level must be between 0 and ${maxDownline}`);
                }
            }

            // Check if commission percentages sum to 100
            const totalPercentage = commissions.reduce((sum, c) => sum + parseFloat(c.commission_percentage), 0);
            if (Math.abs(totalPercentage - 100) > 0.01) { // Allow small floating point error
                throw new Error('Total commission percentage must equal 100');
            }

            return true;
        }),
    body('commissions.*.level').notEmpty().withMessage('Level is required').isInt({ min: 0 }).withMessage('Level must be a non-negative number'),
    body('commissions.*.commission_percentage').notEmpty().withMessage('Commission percentage is required').isFloat({ min: 0, max: 100 }).withMessage('Commission percentage must be between 0 and 100'),
    body('commissions.*.role_id').notEmpty().withMessage('Role ID is required').isUUID(4).withMessage('Invalid Role ID'),
];


export const validateGetCommission = [
    query('type').notEmpty().withMessage('Type is required').isIn(['dietitian', 'corporate_client']).withMessage('Invalid type'),
    query('max_downline').notEmpty().withMessage('Max downline is required').isInt({ min: 0 }).withMessage('Max downline must be at least 0'),
];

export const validateUpdateCommission = [
    body('type').notEmpty().withMessage('Type is required').isIn(['dietitian', 'corporate_client']).withMessage('Invalid type'),
    body('max_downline').notEmpty().withMessage('Max downline is required').isInt({ min: 0 }).withMessage('Max downline must be at least 0'),
    ...validateCreateCommission,
]