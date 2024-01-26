"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../../Utilities/Errors/appError"));
const auth_repository_1 = __importDefault(require("../../Repository/Auth/auth.repository"));
const user_repository_1 = __importDefault(require("../../Repository/Users/user.repository"));
const utils_1 = __importStar(require("../../Utilities/utils"));
const mailer_1 = require("../Email/mailer");
const authRepository = new auth_repository_1.default();
const userRepository = new user_repository_1.default();
const util = new utils_1.default();
const mail = new mailer_1.MalierService();
class GLobalService {
    editProfile(req, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const { companyName, fullName, position, phoneNumber, address, numberOfStaff, location, } = req.body;
            const payload = {
                companyName,
                fullName,
                position,
                phoneNumber,
                address,
                numberOfStaff,
                location,
            };
            const result = yield userRepository.findUserByIdAndUpdate(user._id, payload);
            if (result) {
                return result;
            }
            return next(new appError_1.default("Email address already exist", utils_1.statusCode.conflict()));
        });
    }
    editPassword(req, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const { email, newPassword, confirmPassword, OTP } = req.body;
            const passwordValue = newPassword === confirmPassword
                ? newPassword
                : next(new appError_1.default("passwords don't match", utils_1.statusCode.badRequest()));
            // HASH PASSWORD
            const hashPassword = yield util.generateHash(passwordValue);
            const result = yield userRepository.findUserById(user._id);
            if (!result) {
                return next(new appError_1.default("user not found", utils_1.statusCode.notFound()));
            }
            if (OTP !== String(result.OTP)) {
                return next(new appError_1.default("Invalid OTP", utils_1.statusCode.badRequest()));
            }
            const otpExpiresAt = Date.parse(result === null || result === void 0 ? void 0 : result.otpExpiresAt);
            if (Date.now() > otpExpiresAt) {
                return next(new appError_1.default("Invalid OTP or OTP has expired", utils_1.statusCode.badRequest()));
            }
            const userData = { hashPassword, email };
            const resetUser = yield authRepository.resetPassword(userData.email, userData.hashPassword);
            if (!resetUser) {
                return next(new appError_1.default("Error updating password", utils_1.statusCode.badRequest()));
            }
            const data = {
                email,
                subject: "Password Change Notification",
            };
            // await mail.resetPasswordMail(data);
            return resetUser;
        });
    }
}
exports.default = GLobalService;
