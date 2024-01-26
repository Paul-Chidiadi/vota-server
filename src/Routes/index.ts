import { Router } from "express";
import authRoute from "./Auth/auth.route";
import electorRoute from "./Electors/elector.route";
import organization from "./Organizations/organization.route";
import global from "./Global/global.route";

const router = Router();

// authentication routes
router.use("/auth", authRoute);

// global routes
router.use("/global", global);

// elector routes
router.use("/elector", electorRoute);

// organization routes
router.use("/organization", organization);

export default router;
