import { Router } from "express";
import { voteEventValidationRules } from "../../Middlewares/Electors/elector.middleware";

import {
  getAllElector,
  getElector,
  getAllElectorsOrganization,
  getAllElectorsEvent,
  joinOrganizationRequest,
  leaveOrganization,
  ignoreRequest,
  acceptRequest,
  vote,
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

router.post(
  "/joinOrganizationRequest/:organizationId",
  authenticate,
  joinOrganizationRequest
);
router.patch(
  "/leaveOrganization/:organizationId",
  authenticate,
  leaveOrganization
);
router.patch("/ignoreRequest/:notificationId", authenticate, ignoreRequest);
router.patch("/acceptRequest/:notificationId", authenticate, acceptRequest);
router.patch(
  "/vote/:eventId",
  voteEventValidationRules(),
  validate,
  authenticate,
  vote
);

export default router;
