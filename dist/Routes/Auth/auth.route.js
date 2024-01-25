"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../Middlewares/Auth/auth.middleware");
const auth_controller_1 = require("../../Controllers/Auth/auth.controller");
const reqValidation_middleware_1 = __importDefault(require("../../Middlewares/reqValidation.middleware"));
const router = (0, express_1.Router)();
router.post("/elector/signUp", (0, auth_middleware_1.electorSignUpValidationRules)(), reqValidation_middleware_1.default, auth_controller_1.signUp);
router.post("/organization/signUp", (0, auth_middleware_1.organizationSignUpValidationRules)(), reqValidation_middleware_1.default, auth_controller_1.signUp);
router.post("/activateAccount", (0, auth_middleware_1.otpValidationRules)(), reqValidation_middleware_1.default, auth_controller_1.activateUserAccount);
router.post("/resendOTP", (0, auth_middleware_1.emailValidationRules)(), reqValidation_middleware_1.default, auth_controller_1.resendOTP);
router.post("/login", (0, auth_middleware_1.loginValidationRules)(), reqValidation_middleware_1.default, auth_controller_1.login);
router.get("/refreshToken", (0, auth_middleware_1.refreshTokenValidationRules)(), reqValidation_middleware_1.default, auth_controller_1.refreshToken);
router.post("/forgotPassword", (0, auth_middleware_1.emailValidationRules)(), reqValidation_middleware_1.default, auth_controller_1.forgotPassword);
router.post("/resetPassword", (0, auth_middleware_1.resetPasswordValidationRules)(), reqValidation_middleware_1.default, auth_controller_1.resetPassword);
exports.default = router;
