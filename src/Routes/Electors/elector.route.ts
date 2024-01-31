import { Router } from "express";
import { createEventValidationRules } from "../../Middlewares/Electors/elector.middleware";

import {
  getAllElector,
  getElector,
  getAllElectorsOrganization,
  getAllElectorsEvent,
} from "../../Controllers/Electors/elector.controller";
import validate from "../../Middlewares/reqValidation.middleware";
import authenticate from "../../Middlewares/verifyToken.middleware";

const router = Router();

router.get(
  "/getAllElectorsOrganization",
  authenticate,
  getAllElectorsOrganization
);
router.get("/getAllElectorsEvent", authenticate, getAllElectorsEvent);
router.get("/getElector", authenticate, getAllElector);
router.get("/:electorId", authenticate, getElector);

// router.post("/addMemberRequest/:memberId", authenticate, addMemberRequest);
// router.patch("/removeMember/:memberId", authenticate, removeMember);

export default router;
