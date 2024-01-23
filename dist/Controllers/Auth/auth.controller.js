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
exports.signUp = void 0;
const auth_service_1 = __importDefault(require("../../Services/Auth/auth.service"));
const appError_1 = __importDefault(require("../../Utilities/Errors/appError"));
const utils_1 = require("../../Utilities/utils");
const authService = new auth_service_1.default();
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authService.signUp(req, next);
        if (user) {
            return res.status(utils_1.statusCode.created()).json({
                status: "success",
                message: "Account successfully created, Check your mail for activation code",
                user,
            });
        }
    }
    catch (err) {
        return next(new appError_1.default(`something went wrong ${err}`, utils_1.statusCode.internalServerError()));
    }
});
exports.signUp = signUp;
