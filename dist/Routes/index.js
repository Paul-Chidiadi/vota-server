"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./Auth/auth.route"));
const elector_route_1 = __importDefault(require("./Electors/elector.route"));
const organization_route_1 = __importDefault(require("./Organizations/organization.route"));
const router = (0, express_1.Router)();
// authentication routes
router.use("/auth", auth_route_1.default);
// global routes
router.use("/global", organization_route_1.default);
// elector routes
router.use("/elector", elector_route_1.default);
// organization routes
router.use("/organization", organization_route_1.default);
exports.default = router;
