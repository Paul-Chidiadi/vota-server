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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    companyName: {
        type: String,
    },
    fullName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    displayPicture: {
        type: String,
    },
    displayPictureId: {
        type: String,
    },
    logo: {
        type: String,
    },
    logoId: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "An email must be provided"],
        unique: true,
        lowercase: true,
    },
    position: {
        type: String,
    },
    organizations: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    location: {
        type: String,
    },
    address: {
        type: String,
    },
    numberOfStaff: {
        type: String,
    },
    role: {
        type: String,
        enum: ["Elector", "Organization", "Admin"],
    },
    eventsEngaged: {
        type: Number,
    },
    eventsConducted: {
        type: Number,
    },
    eventsOngoing: {
        type: Number,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false,
    },
    OTP: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.User = mongoose_1.default.model("User", userSchema);
