import { Router } from "express";
import {
  electorSignUpValidationRules,
  organizationSignUpValidationRules,
} from "../../Middlewares/Auth/auth.middleware";

import { signUp } from "../../Controllers/Auth/auth.controller";
import validate from "../../Middlewares/reqValidation.middleware";

const router = Router();

router.post(
  "/elector/signUp",
  electorSignUpValidationRules(),
  validate,
  signUp
);
router.post(
  "/organization/signUp",
  organizationSignUpValidationRules(),
  validate,
  signUp
);

export default router;
