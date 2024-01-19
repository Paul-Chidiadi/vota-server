"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.sendErrorProd = exports.sendErrorDev = void 0;
require("dotenv/config");
const sendErrorDev = (err, res) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: err.statusCode,
        message: err.message,
        error: err,
        stack: err.stack,
        name: err.name,
    });
};
exports.sendErrorDev = sendErrorDev;
const sendErrorProd = (err, res) => {
    const statusCode = err.statusCode || 500;
    if (err.isOperational) {
        return res.status(statusCode).json({
            success: false,
            message: err.message,
            name: err.name,
            operation: err.isOperational,
        });
    }
};
exports.sendErrorProd = sendErrorProd;
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.ENV === "development") {
        (0, exports.sendErrorDev)(err, res);
    }
    if (process.env.ENV === "production") {
        (0, exports.sendErrorProd)(err, res);
        const error = Object.assign({}, err);
        if (error.name === "ExpiredCodeException") {
            const { message } = error;
            const status = error.statusCode || 401;
            return res.status(status).json({
                success: false,
                message,
            });
        }
        if (error.name === "Error") {
            res.status(error.statusCode || 401);
            return res.json({
                success: false,
                message: error.message,
            });
        }
        if (error.name === "NotAuthorizedException") {
            const status = error.statusCode || 401;
            return res.status(status).json({
                success: false,
                error: error.message,
            });
        }
        if (error.name === "TokenExpiredError") {
            const status = error.statusCode || 401;
            return res.status(status).json({
                success: false,
                error: error.message,
            });
        }
    }
    else {
        return res.status(err.statusCode || 400).json({
            success: false,
            error: err.message,
            message: "This wasn't supposed to happen Our engineers are working on it. How about a fresh start?",
        });
    }
};
exports.errorHandler = errorHandler;
