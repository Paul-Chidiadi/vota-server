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
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../Models/Users/user.model");
class AuthRepository {
    signUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.create(payload);
            return user;
        });
    }
    activateUserAccount(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_model_1.User.findOneAndUpdate({ email: userEmail }, { isEmailVerified: true });
            return result;
        });
    }
    resetPassword(userEmail, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateUserPassword = yield user_model_1.User.findOneAndUpdate({ email: userEmail }, { password: newPassword });
            return updateUserPassword;
        });
    }
    UpdateOTP(userEmail, OTP, otpExpiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_model_1.User.findOneAndUpdate({ email: userEmail }, { OTP, otpExpiresAt }).exec();
            return result;
        });
    }
}
exports.default = AuthRepository;
