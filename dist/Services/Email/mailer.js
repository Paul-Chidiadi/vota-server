"use strict";
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
exports.MalierService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const utils_1 = __importDefault(require("../../Utilities/utils"));
const user_repository_1 = __importDefault(require("../../Repository/Users/user.repository"));
const userRepository = new user_repository_1.default();
dotenv_1.default.config({ path: ".env" });
const util = new utils_1.default();
class MalierService {
    constructor() {
        this.emailFrom = process.env.EMAIL_FROM;
        this.GMAIL_HOST = process.env.GMAIL_HOST;
        this.GMAIL_USERNAME = process.env.GMAIL_USERNAME;
        this.GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
        this.SERVICE_NAME = process.env.SERVICE_NAME;
        this.GMAIL_PORT = process.env.GMAIL_PORT;
        this.baseUrl = process.env.BASE_URL;
    }
    sendMail(options, template) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = yield util.convertEmailToText(template);
            const msg = {
                to: options.email,
                from: this.emailFrom,
                subject: options.subject,
                text,
                html: template,
            };
            if (process.env.NODE_ENV === "production") {
                const transporter = nodemailer_1.default.createTransport({
                    service: this.SERVICE_NAME,
                    host: this.GMAIL_HOST,
                    port: Number(this.GMAIL_PORT),
                    auth: {
                        user: this.GMAIL_USERNAME,
                        pass: this.GMAIL_PASSWORD,
                    },
                });
                // send the email with nodemailer
                const result = yield transporter.sendMail(msg);
                return result;
            }
            const transporter = nodemailer_1.default.createTransport({
                service: this.SERVICE_NAME,
                host: this.GMAIL_HOST,
                port: Number(this.GMAIL_PORT),
                auth: {
                    user: this.GMAIL_USERNAME,
                    pass: this.GMAIL_PASSWORD,
                },
            });
            // send the email with nodemailer
            const result = yield transporter.sendMail(msg);
            return result;
        });
    }
    sendOTP(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.otp !== undefined && options.otp.toString().length === 6) {
                const message = `<p>Hello,</p>
      <p>Welcome to VOTA. Please verify your 
      email address with the OTP code below. It would expire after 10mins.<p>
      <p>OTP: <b>${options.otp}</b></p>`;
                const result = yield this.sendMail(options, message);
                return result;
            }
        });
    }
    accountActivationMail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `<p>Welcome to VOTA,
    your account have been activated. Kindly login to continue<p>`;
            const result = yield this.sendMail(options, message);
            return result;
        });
    }
    forgotPasswordMail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.otp !== undefined && options.otp.toString().length === 6) {
                const message = `<p>Hi, <br> 
        <p>We received a request to reset your password, to reset your password use the code below and follow the instructions.<br> 
        <b>Code: ${options.otp}</b><br>

       <p>If you didn't request this, please ignore this email.
        </p>
        Thanks,  <br> 
        Team VOTA <p/>`;
                const result = yield this.sendMail(options, message);
                return result;
            }
        });
    }
    resetPasswordMail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `<p>
    Hi, <br> 
    You have successfully reset your password.
      <br> 
    Team VOTA <p/>`;
            const result = yield this.sendMail(options, message);
            return result;
        });
    }
}
exports.MalierService = MalierService;
