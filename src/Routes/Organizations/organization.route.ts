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
  removeMember,
  getAllOrganization,
  getOrganization,
  ignoreRequest,
  acceptRequest,
  uploadLogoImage,
} from "../../Controllers/Organizations/organization.controller";
import validate from "../../Middlewares/reqValidation.middleware";
import authenticate from "../../Middlewares/verifyToken.middleware";
import { upload } from "../../Utilities/utils";

const router = Router();

router.post(
  "/createEvent",
  createEventValidationRules(),
  validate,
  authenticate,
  createEvent
);
router.get("/getAllOrganizationsEvent", authenticate, getAllOrganizationsEvent);
router.get(
  "/getAllOrganizationsMembers",
  authenticate,
  getAllOrganizationsMembers
);
router.get("/getOrganization", authenticate, getAllOrganization);
router.get("/:organizationId", authenticate, getOrganization);
router.patch(
  "/editEvent/:eventId",
  editEventValidationRules(),
  validate,
  authenticate,
  editEvent
);
router.delete("/cancelEvent/:eventId", authenticate, cancelEvent);
router.patch("/endEvent/:eventId", authenticate, endEvent);
router.post("/addMemberRequest/:memberId", authenticate, addMemberRequest);
router.patch("/removeMember/:memberId", authenticate, removeMember);
router.patch("/ignoreRequest/:notificationId", authenticate, ignoreRequest);
router.patch("/acceptRequest/:notificationId", authenticate, acceptRequest);
router.patch(
  "/uploadLogoImage",
  upload.single("image"),
  validate,
  authenticate,
  uploadLogoImage
);

export default router;
