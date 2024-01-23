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
const user_repository_1 = __importDefault(require("../Repository/Users/user.repository"));
const appError_1 = __importDefault(require("../Utilities/Errors/appError"));
const utils_1 = __importDefault(require("../Utilities/utils"));
const userRepository = new user_repository_1.default();
const util = new utils_1.default();
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: "please provide an authorization header to gain access",
                success: false,
            });
        }
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                message: "Invalid authorization header",
                success: false,
            });
        }
        const decoded = (yield util.verifyJWT(token));
        if (decoded.expired === true) {
            return next(new appError_1.default("Expired token please login", 403));
        }
        const currentUser = yield userRepository.findUserById(decoded.payload.id);
        if (!currentUser) {
            return res.status(401).json({
                message: "the user belongs to the token no longer exist.",
                success: false,
            });
        }
        // req.user = currentUser;
        next();
    }
    catch (error) {
        return next(new appError_1.default(`something went wrong here is the error ${error}`, 500));
    }
});
exports.default = authenticate;
