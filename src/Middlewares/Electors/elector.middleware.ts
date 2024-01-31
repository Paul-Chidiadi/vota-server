import { Response, NextFunction } from "express";
import { body, check } from "express-validator";

export const createEventValidationRules = () => {
  return [
    body("eventName")
      .trim()
      .notEmpty()
      .withMessage("Event Name can not be empty"),
    body("eventType")
      .trim()
      .notEmpty()
      .withMessage("Event Type can not be empty"),
    body("schedule").trim().notEmpty().withMessage("Schedule can not be empty"),
    body("positions")
      // .trim()
      .optional()
      .notEmpty()
      .withMessage("Positions can not be empty"),
    body("candidates")
      // .trim()
      .optional()
      .notEmpty()
      .withMessage("Candidates can not be empty"),
    body("pollQuestions")
      // .trim()
      .optional()
      .notEmpty()
      .withMessage("Poll Questions can not be empty"),
    body("isPublic").trim().notEmpty().withMessage("Public can not be empty"),
  ];
};
