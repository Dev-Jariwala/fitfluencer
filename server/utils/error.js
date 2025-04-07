// Helper function to handle errors
import winston from "winston";
const errorLogger = winston.loggers.get("error-logger");
const paymentLogger = winston.loggers.get("payment-logger");

export const handleError = (fnName, res, error, message = "Internal server error") => {
    console.error(`Error in function : ${fnName}: `, error);
    errorLogger.error(error);
    
    // If the error is from a payment-related function, also log it to payment logger
    if (fnName.toLowerCase().includes('payment')) {
        paymentLogger.info('Payment processing error', {
            function: fnName,
            error: error.message,
            stack: error.stack,
            time: new Date().toISOString()
        });
    }
    
    return res.status(500).json({ success: false, message, error: error.message });
};