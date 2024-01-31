import { Router } from "express";
import {
  editProfileValidationRules,
  editPasswordValidationRules,
  editEmailValidationRules,
} from "../../Middlewares/Global/global.middleware";

import {
  editProfile,
  editPassword,
  editEmail,
  getEvent,
} from "../../Controllers/Global/global.controller";
import validate from "../../Middlewares/reqValidation.middleware";
import authenticate from "../../Middlewares/verifyToken.middleware";

const router = Router();

router.patch(
  "/editProfile",
  editProfileValidationRules(),
  validate,
  authenticate,
  editProfile
);
router.patch(
  "/editPassword",
  editPasswordValidationRules(),
  validate,
  authenticate,
  editPassword
);
router.patch(
  "/editEmail",
  editEmailValidationRules(),
  validate,
  authenticate,
  editEmail
);
router.get("/getEvent/:eventId", authenticate, getEvent);

export default router;
