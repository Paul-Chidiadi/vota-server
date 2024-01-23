"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const resultErrors = [];
    errors.array().map((err) => resultErrors.push({ [err.path]: err.msg }));
    resultErrors.push({ message: "Action unsuccessful" });
    resultErrors.push({ success: false });
    const errorObject = Object.assign({}, ...resultErrors);
    return res.status(422).json(errorObject);
};
exports.default = validate;
