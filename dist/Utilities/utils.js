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
exports.statusCode = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const html_to_text_1 = require("html-to-text");
// import path from 'path';
// import { v2 as cloudinary } from 'cloudinary';
// import { customAlphabet } from 'nanoid';
// import fs from 'fs';
// import multer from 'multer';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_repository_1 = __importDefault(require("../Repository/Users/user.repository"));
const userRepository = new user_repository_1.default();
class Utilities {
    constructor() {
        this.pepper = String(process.env.BCRYPT_PASSWORD);
        this.saltRound = Number(process.env.SALT_ROUNDS);
        this.accessToken = process.env.ACCESSTOKENSECRET;
        this.generateRandomCode = (size = 8, alpha = true) => {
            const characters = alpha
                ? "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-"
                : "0123456789";
            const chars = characters.split("");
            let selections = "";
            for (let i = 0; i < size; i += 1) {
                const index = Math.floor(Math.random() * chars.length);
                selections += chars[index];
                chars.splice(index, 1);
            }
            return selections;
        };
    }
    verifyJWT(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return {
                    payload: jsonwebtoken_1.default.verify(token, this.accessToken),
                    expired: false,
                };
            }
            catch (error) {
                if (error.name === "TokenExpiredError") {
                    return { payload: jsonwebtoken_1.default.decode(token), expired: true };
                }
                throw error;
            }
        });
    }
    generateHash(plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(plainPassword + this.pepper, this.saltRound);
            return hash;
        });
    }
    isValidMongoId(id) {
        return mongoose_1.default.Types.ObjectId.isValid(id);
    }
    convertIdToMongoId(id) {
        const objectId = new mongoose_1.default.Types.ObjectId(id);
        return objectId;
    }
    generateOtpCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const OTP = this.generateRandomCode(6, false);
            return {
                OTP,
                otpExpiresAt: Date.now() + 10 * 60 * 1000,
            };
        });
    }
    abbreviateOrganisation(organisation) {
        const words = organisation.split(" ");
        const abbreviation = words.map((word) => word.charAt(0)).join("");
        return abbreviation.toUpperCase();
    }
    convertEmailToText(html) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, html_to_text_1.convert)(html, {
                wordwrap: 150,
            });
            return result;
        });
    }
    comparePassword(password, hashPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield bcrypt_1.default.compare(password + this.pepper, hashPassword);
            return result;
        });
    }
    generateToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessTokenSecret = process.env.ACCESSTOKENSECRET;
            const refreshTokenSecret = process.env.REFRESHTOKENSECRET;
            const payload = yield userRepository.findUserByEmail(email);
            const data = {
                id: payload._id,
                role: payload.role,
                email: payload.email,
            };
            const accessToken = jsonwebtoken_1.default.sign(data, accessTokenSecret, {
                expiresIn: "1800s",
            });
            const refreshToken = jsonwebtoken_1.default.sign(data, refreshTokenSecret, {
                expiresIn: "1d",
            });
            return Promise.resolve({ accessToken, refreshToken });
        });
    }
    // verify refresh token
    verifyToken(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.decode(token);
                const expirationTime = decoded.exp;
                const currentTime = Math.floor(Date.now() / 1000);
                if (currentTime > expirationTime || decoded.email !== email) {
                    // token has expired
                    return false;
                }
                // token is still valid
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    decodeJwtToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = jsonwebtoken_1.default.decode(token);
            return decoded;
        });
    }
    Date() {
        const currentdate = new Date();
        const datetime = `Last Sync: ${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
        return datetime;
    }
}
exports.default = Utilities;
exports.statusCode = {
    ok() {
        return 200;
    },
    created() {
        return 201;
    },
    accepted() {
        return 202;
    },
    noContent() {
        return 204;
    },
    resetContent() {
        return 205;
    },
    partialContent() {
        return 206;
    },
    badRequest() {
        return 400;
    },
    unauthorized() {
        return 401;
    },
    paymentRequired() {
        return 402;
    },
    accessForbidden() {
        return 403;
    },
    notFound() {
        return 404;
    },
    methodNotAllowed() {
        return 405;
    },
    notAccepted() {
        return 406;
    },
    proxyAuthenticationRequired() {
        return 407;
    },
    requestTimeout() {
        return 408;
    },
    conflict() {
        return 409;
    },
    unprocessableEntity() {
        return 422;
    },
    internalServerError() {
        return 500;
    },
    notImplemented() {
        return 501;
    },
    badGateway() {
        return 502;
    },
    serviceUnavalaibleError() {
        return 503;
    },
    gatewayTimeout() {
        return 504;
    },
};
