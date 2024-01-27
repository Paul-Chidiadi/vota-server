import { Router } from "express";
import {
  createEventValidationRules,
  editEventValidationRules,
} from "../../Middlewares/Organizations/organization.middleware";

import {
  createEvent,
  editEvent,
  cancelEvent,
  endEvent,
  getAllOrganizationsEvent,
  getAllOrganizationsMembers,
  addMemberRequest,
} from "../../Controllers/Organizations/organization.controller";
import validate from "../../Middlewares/reqValidation.middleware";
import authenticate from "../../Middlewares/verifyToken.middleware";

const router = Router();

router.post(
  "/createEvent",
  createEventValidationRules(),
  validate,
  authenticate,
  createEvent
);
router.patch(
  "/editEvent/:eventId",
  editEventValidationRules(),
  validate,
  authenticate,
  editEvent
);
router.delete("/cancelEvent/:eventId", authenticate, cancelEvent);
router.patch("/endEvent/:eventId", authenticate, endEvent);
router.get("/getAllOrganizationsEvent", authenticate, getAllOrganizationsEvent);
router.get(
  "/getAllOrganizationsMembers",
  authenticate,
  getAllOrganizationsMembers
);
router.post("/addMemberRequest/:memberId", authenticate, addMemberRequest);

export default router;
