import { Response, NextFunction } from "express";
import { body, check } from "express-validator";

export const electorSignUpValidationRules = () => {
  return [
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Full Name can not be empty"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password can not be empty")
      .isLength({ min: 6, max: 16 })
      .withMessage(
        "Password must be between min of 6 and max of 16 characters"
      ),
    body("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("Confirm Password can not be empty")
      .isLength({ min: 6, max: 16 })
      .withMessage(
        "Password must be between min of 6 and max of 16 characters"
      ),
    body("email").trim().isEmail().withMessage("please enter a valid Email"),
  ];
};

export const organizationSignUpValidationRules = () => {
  return [
    body("companyName")
      .trim()
      .notEmpty()
      .withMessage("Company Name can not be empty"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password can not be empty")
      .isLength({ min: 6, max: 16 })
      .withMessage(
        "Password must be between min of 6 and max of 16 characters"
      ),
    body("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("Confirm Password can not be empty")
      .isLength({ min: 6, max: 16 })
      .withMessage(
        "Password must be between min of 6 and max of 16 characters"
      ),
    body("email").trim().isEmail().withMessage("please enter a valid Email"),
  ];
};

export const otpValidationRules = () => {
  return [
    body("OTP")
      .trim()
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP code must be 4 digit long"),
    body("email").trim().isEmail().withMessage("please enter a valid email"),
  ];
};

export const emailValidationRules = () => {
  return [
    body("email").trim().isEmail().withMessage("please enter a valid email"),
  ];
};

export const loginValidationRules = () => {
  return [
    body("email").trim().isEmail().withMessage("please enter a valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password can not be empty")
      .isLength({ min: 6, max: 16 })
      .withMessage(
        "Password must be between min of 6 and max of 16 characters"
      ),
  ];
};

export const refreshTokenValidationRules = () => {
  return [
    check("x-user-email").notEmpty().withMessage("Email header is required"),
    check("x-user-token")
      .notEmpty()
      .withMessage("Refresh Token header is required"),
  ];
};

export const resetPasswordValidationRules = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("Password can not be empty")
      .isLength({ min: 6, max: 16 })
      .withMessage("Password must be between 6 and 16 characters"),
    body("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("Password can not be empty")
      .isLength({ min: 6, max: 16 })
      .withMessage("Password must be between 6 and 16 characters"),
    body("email").trim().isEmail().withMessage("please enter a valid email"),
    body("OTP")
      .trim()
      .isNumeric()
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be at least 4 character long"),
  ];
};
