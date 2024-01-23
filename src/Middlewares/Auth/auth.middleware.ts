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
