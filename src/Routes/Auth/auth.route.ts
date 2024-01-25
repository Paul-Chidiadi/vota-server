import { Router } from "express";
import {
  electorSignUpValidationRules,
  organizationSignUpValidationRules,
  otpValidationRules,
  emailValidationRules,
  loginValidationRules,
} from "../../Middlewares/Auth/auth.middleware";

import {
  signUp,
  activateUserAccount,
  resendOTP,
  login,
} from "../../Controllers/Auth/auth.controller";
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
router.post(
  "/activateAccount",
  otpValidationRules(),
  validate,
  activateUserAccount
);
router.post("/resendOTP", emailValidationRules(), validate, resendOTP);
router.post("/login", loginValidationRules(), validate, login);

export default router;
