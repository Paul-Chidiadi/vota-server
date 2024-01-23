import { Router } from "express";
import authRoute from "./Auth/auth.route";
import electorRoute from "./Electors/elector.route";
import organization from "./Organizations/organization.route";

const router = Router();

// authentication routes
router.use("/auth", authRoute);

// elector routes
router.use("/elector", electorRoute);

// organization routes
router.use("/organization", organization);

export default router;
