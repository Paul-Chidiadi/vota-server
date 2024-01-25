"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationRules = exports.emailValidationRules = exports.otpValidationRules = exports.organizationSignUpValidationRules = exports.electorSignUpValidationRules = void 0;
const express_validator_1 = require("express-validator");
const electorSignUpValidationRules = () => {
    return [
        (0, express_validator_1.body)("fullName")
            .trim()
            .notEmpty()
            .withMessage("Full Name can not be empty"),
        (0, express_validator_1.body)("password")
            .trim()
            .notEmpty()
            .withMessage("Password can not be empty")
            .isLength({ min: 6, max: 16 })
            .withMessage("Password must be between min of 6 and max of 16 characters"),
        (0, express_validator_1.body)("confirmPassword")
            .trim()
            .notEmpty()
            .withMessage("Confirm Password can not be empty")
            .isLength({ min: 6, max: 16 })
            .withMessage("Password must be between min of 6 and max of 16 characters"),
        (0, express_validator_1.body)("email").trim().isEmail().withMessage("please enter a valid Email"),
    ];
};
exports.electorSignUpValidationRules = electorSignUpValidationRules;
const organizationSignUpValidationRules = () => {
    return [
        (0, express_validator_1.body)("companyName")
            .trim()
            .notEmpty()
            .withMessage("Company Name can not be empty"),
        (0, express_validator_1.body)("password")
            .trim()
            .notEmpty()
            .withMessage("Password can not be empty")
            .isLength({ min: 6, max: 16 })
            .withMessage("Password must be between min of 6 and max of 16 characters"),
        (0, express_validator_1.body)("confirmPassword")
            .trim()
            .notEmpty()
            .withMessage("Confirm Password can not be empty")
            .isLength({ min: 6, max: 16 })
            .withMessage("Password must be between min of 6 and max of 16 characters"),
        (0, express_validator_1.body)("email").trim().isEmail().withMessage("please enter a valid Email"),
    ];
};
exports.organizationSignUpValidationRules = organizationSignUpValidationRules;
const otpValidationRules = () => {
    return [
        (0, express_validator_1.body)("OTP")
            .trim()
            .isLength({ min: 6, max: 6 })
            .withMessage("OTP code must be 4 digit long"),
        (0, express_validator_1.body)("email").trim().isEmail().withMessage("please enter a valid email"),
    ];
};
exports.otpValidationRules = otpValidationRules;
const emailValidationRules = () => {
    return [
        (0, express_validator_1.body)("email").trim().isEmail().withMessage("please enter a valid email"),
    ];
};
exports.emailValidationRules = emailValidationRules;
const loginValidationRules = () => {
    return [
        (0, express_validator_1.body)("email").trim().isEmail().withMessage("please enter a valid email"),
        (0, express_validator_1.body)("password")
            .trim()
            .notEmpty()
            .withMessage("Password can not be empty")
            .isLength({ min: 6, max: 16 })
            .withMessage("Password must be between min of 6 and max of 16 characters"),
    ];
};
exports.loginValidationRules = loginValidationRules;
