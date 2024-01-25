import { Router } from "express";
import {
  electorSignUpValidationRules,
  organizationSignUpValidationRules,
  otpValidationRules,
  emailValidationRules,
  loginValidationRules,
  refreshTokenValidationRules,
  resetPasswordValidationRules,
} from "../../Middlewares/Auth/auth.middleware";

import {
  signUp,
  activateUserAccount,
  resendOTP,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
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
router.get(
  "/refreshToken",
  refreshTokenValidationRules(),
  validate,
  refreshToken
);
router.post(
  "/forgotPassword",
  emailValidationRules(),
  validate,
  forgotPassword
);
router.post(
  "/resetPassword",
  resetPasswordValidationRules(),
  validate,
  resetPassword
);
export default router;
