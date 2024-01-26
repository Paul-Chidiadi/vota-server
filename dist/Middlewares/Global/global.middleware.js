"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPasswordValidationRules = exports.editProfileValidationRules = void 0;
const express_validator_1 = require("express-validator");
const editProfileValidationRules = () => {
    return [
        (0, express_validator_1.body)("fullName")
            .trim()
            .optional()
            .notEmpty()
            .withMessage("Full Name can not be empty"),
        (0, express_validator_1.body)("companyName")
            .trim()
            .optional()
            .notEmpty()
            .withMessage("Company Name can not be empty"),
        (0, express_validator_1.body)("phoneNumber")
            .trim()
            .notEmpty()
            .withMessage("Phone Numebr can not be empty"),
        (0, express_validator_1.body)("location")
            .trim()
            .optional()
            .notEmpty()
            .withMessage("location can not be empty"),
        (0, express_validator_1.body)("organization")
            .trim()
            .optional()
            .notEmpty()
            .withMessage("Organization can not be empty"),
        (0, express_validator_1.body)("position")
            .trim()
            .optional()
            .notEmpty()
            .withMessage("Position can not be empty"),
        (0, express_validator_1.body)("numberOfStaff")
            .trim()
            .optional()
            .notEmpty()
            .withMessage("Number of Staff can not be empty"),
        (0, express_validator_1.body)("address")
            .trim()
            .optional()
            .notEmpty()
            .withMessage("Address can not be empty"),
    ];
};
exports.editProfileValidationRules = editProfileValidationRules;
const editPasswordValidationRules = () => {
    return [
        (0, express_validator_1.body)("email").trim().isEmail().withMessage("please enter a valid email"),
        (0, express_validator_1.body)("newPassword")
            .trim()
            .notEmpty()
            .withMessage("Password can not be empty")
            .isLength({ min: 6, max: 16 })
            .withMessage("Password must be between 6 and 16 characters"),
        (0, express_validator_1.body)("confirmPassword")
            .trim()
            .notEmpty()
            .withMessage("Password can not be empty")
            .isLength({ min: 6, max: 16 })
            .withMessage("Password must be between 6 and 16 characters"),
        (0, express_validator_1.body)("OTP")
            .trim()
            .isNumeric()
            .isLength({ min: 6, max: 6 })
            .withMessage("OTP must be at least 4 character long"),
    ];
};
exports.editPasswordValidationRules = editPasswordValidationRules;
