import { Response, NextFunction } from "express";
import { body, check } from "express-validator";

export const editProfileValidationRules = () => {
  return [
    body("fullName")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Full Name can not be empty"),
    body("companyName")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Company Name can not be empty"),
    body("phoneNumber")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Phone Number can not be empty"),
    body("location")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("location can not be empty"),
    body("organization")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Organization can not be empty"),
    body("position")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Position can not be empty"),
    body("numberOfStaff")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Number of Staff can not be empty"),
    body("address")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Address can not be empty"),
  ];
};

export const editPasswordValidationRules = () => {
  return [
    body("email").trim().isEmail().withMessage("please enter a valid email"),
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
    body("OTP")
      .trim()
      .isNumeric()
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be at least 4 character long"),
  ];
};

export const editEmailValidationRules = () => {
  return [
    body("email").trim().isEmail().withMessage("please enter a valid email"),
    body("OTP")
      .trim()
      .isNumeric()
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be at least 4 character long"),
  ];
};
