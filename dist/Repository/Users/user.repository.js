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
class UserRepository {
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.User.find();
            return users;
        });
    }
    findOneUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findOne({ _id: id })
                .lean()
                .select("+password -isActive -OTP -__v");
            return user;
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findById(userId).select("-password -isEmailVerified -OTP  -displayPictureId");
            return user;
        });
    }
    findUserByEmail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_model_1.User.findOne({
                email: userEmail,
            })
                .select("+password")
                .exec();
            return result;
        });
    }
    findUserByIdAndUpdate(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findByIdAndUpdate({ _id: id }, payload, {
                new: true,
            })
                .select("-password -OTP -__v")
                .exec();
            return user;
        });
    }
    findUserByCodeAndEmail(userEmail, OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findOne({ email: userEmail, OTP }).exec();
            return user;
        });
    }
    isVerified(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserByEmail(userEmail);
            if (user.isEmailVerified) {
                return user;
            }
            return false;
        });
    }
    UpdatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, { password })
                .select("-OTP")
                .exec();
            return result;
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findByIdAndDelete({ _id: userId });
            return user;
        });
    }
}
exports.default = UserRepository;
