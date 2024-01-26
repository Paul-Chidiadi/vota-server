"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const global_middleware_1 = require("../../Middlewares/Global/global.middleware");
const global_controller_1 = require("../../Controllers/Global/global.controller");
const reqValidation_middleware_1 = __importDefault(require("../../Middlewares/reqValidation.middleware"));
const verifyToken_middleware_1 = __importDefault(require("../../Middlewares/verifyToken.middleware"));
const router = (0, express_1.Router)();
router.patch("/editProfile", (0, global_middleware_1.editProfileValidationRules)(), reqValidation_middleware_1.default, verifyToken_middleware_1.default, global_controller_1.editProfile);
router.patch("/editPassword", (0, global_middleware_1.editPasswordValidationRules)(), reqValidation_middleware_1.default, verifyToken_middleware_1.default, global_controller_1.editPassword);
exports.default = router;
