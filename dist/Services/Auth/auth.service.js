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
class AuthService {
    signUp(req, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyName, fullName, password, email, confirmPassword, account } = req.body;
            if (password !== confirmPassword) {
                return next(new appError_1.default("password do not match", utils_1.statusCode.badRequest()));
            }
            const userExist = yield userRepository.findUserByEmail(email);
            if (userExist === null) {
                const hashPassword = yield util.generateHash(password);
                const { OTP, otpExpiresAt } = yield util.generateOtpCode();
                const user = {
                    fullName,
                    companyName,
                    email,
                    password: hashPassword,
                    OTP,
                    otpExpiresAt,
                    role: account,
                };
                const data = yield authRepository.signUp(user);
                const newUser = {
                    fullName: data.fullName,
                    companyName: data.companyName,
                    id: data.id,
                    email: data.email,
                    role: data.role,
                    isEmailVerified: data.isEmailVerified,
                };
                if (data) {
                    // const userInfo = {
                    //   email: data.email,
                    //   subject: "Verify your VOTA Account",
                    //   otp: data.OTP,
                    // };
                    // await mail.sendOTP(userInfo);
                    return newUser;
                }
            }
            return next(new appError_1.default("Email address already exist", utils_1.statusCode.conflict()));
        });
    }
}
exports.default = AuthService;
