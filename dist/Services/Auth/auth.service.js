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
                    const userInfo = {
                        email: data.email,
                        subject: "Verify your VOTA Account",
                        otp: data.OTP,
                    };
                    // await mail.sendOTP(userInfo);
                    return newUser;
                }
            }
            return next(new appError_1.default("Email address already exist", utils_1.statusCode.conflict()));
        });
    }
    activateUserAccount(req, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { OTP, email } = req.body;
            const user = yield userRepository.findUserByCodeAndEmail(email, OTP);
            const otpExpiresAt = Date.parse(user === null || user === void 0 ? void 0 : user.otpExpiresAt);
            if (otpExpiresAt !== undefined && Date.now() > otpExpiresAt) {
                return next(new appError_1.default("Invalid OTP or OTP has expired", utils_1.statusCode.badRequest()));
            }
            if (user === null) {
                return next(new appError_1.default("Resource for user not found", utils_1.statusCode.notFound()));
            }
            if (user.OTP !== OTP) {
                return next(new appError_1.default("Invalid otp", utils_1.statusCode.unauthorized()));
            }
            if (user.isEmailVerified) {
                return next(new appError_1.default("Email already verified", utils_1.statusCode.unauthorized()));
            }
            const result = yield authRepository.activateUserAccount(email);
            if (result) {
                const userInfo = {
                    email: result.email,
                    subject: "Welcome to VOTA",
                };
                // await mail.accountActivationMail(userInfo);
                return user;
            }
        });
    }
    resendOTP(req, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = yield userRepository.findUserByEmail(email);
            if (user === null) {
                return next(new appError_1.default("User not found", utils_1.statusCode.notFound()));
            }
            const { OTP, otpExpiresAt } = yield util.generateOtpCode();
            const result = yield authRepository.UpdateOTP(email, OTP, otpExpiresAt);
            const userInfo = {
                email,
                subject: "OTP Verification Code",
                otp: OTP,
            };
            // await mail.sendOTP(userInfo);
            return result;
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield userRepository.findUserByEmail(email);
            if (!user) {
                return next(new appError_1.default("Incorrect Email or password", utils_1.statusCode.unprocessableEntity()));
            }
            const isActive = yield userRepository.isVerified(email);
            if (!isActive) {
                return next(new appError_1.default("User account is not active, Kindly activate account", utils_1.statusCode.unauthorized()));
            }
            // if user is active then proceed to further operations
            const hashedPassword = yield util.comparePassword(password, user.password);
            if (hashedPassword) {
                const { accessToken, refreshToken } = yield util.generateToken(user.email);
                // send a mail to the user email on successful login attempt
                res.cookie("jwt", refreshToken, {
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.status(utils_1.statusCode.accepted()).json({
                    success: true,
                    message: "Login successful",
                    accessToken,
                    refreshToken,
                    user,
                });
            }
            else {
                return next(new appError_1.default("Incorrect password", utils_1.statusCode.accessForbidden()));
            }
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.headers["x-user-email"];
            const token = req.headers["x-user-token"];
            const response = yield userRepository.findUserByEmail(email);
            const user = yield userRepository.findOneUser(response === null || response === void 0 ? void 0 : response.id);
            if (!user) {
                return next(new appError_1.default("User with this email not found", utils_1.statusCode.notFound()));
            }
            const isValid = yield util.verifyToken(email, token);
            if (isValid) {
                const { accessToken, refreshToken } = yield util.generateToken(email);
                user.password = "undefined";
                return res.status(200).json({
                    accessToken,
                    refreshToken,
                    data: user,
                });
            }
            return next(new appError_1.default("Invalid token. Please login to gain access", utils_1.statusCode.unauthorized()));
        });
    }
    forgotPassword(req, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = yield userRepository.findUserByEmail(email);
            if (!user) {
                return next(new appError_1.default("User not found", utils_1.statusCode.notFound()));
            }
            const { OTP, otpExpiresAt } = yield util.generateOtpCode();
            const data = {
                email: user.email,
                otp: OTP,
                subject: "Forgot Password Notification",
            };
            // SEND MAIL
            const sendEmail = yield mail.forgotPasswordMail(data);
            if (sendEmail) {
                yield authRepository.UpdateOTP(email, OTP, otpExpiresAt);
                return user;
            }
            return next(new appError_1.default("Notification failed, try again later", utils_1.statusCode.noContent()));
        });
    }
    resetPassword(req, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newPassword, confirmPassword, OTP, email } = req.body;
            const password = newPassword === confirmPassword
                ? newPassword
                : next(new appError_1.default("passwords don't match", utils_1.statusCode.badRequest()));
            // HASH PASSWORD
            const hashPassword = yield util.generateHash(password);
            const user = yield userRepository.findUserByEmail(email);
            if (!user) {
                return next(new appError_1.default("user not found", utils_1.statusCode.notFound()));
            }
            if (OTP !== String(user.OTP)) {
                return next(new appError_1.default("Invalid OTP", utils_1.statusCode.badRequest()));
            }
            const otpExpiresAt = Date.parse(user === null || user === void 0 ? void 0 : user.otpExpiresAt);
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
                subject: "Password Reset Notification",
            };
            // await mail.resetPasswordMail(data);
            return resetUser;
        });
    }
}
exports.default = AuthService;
