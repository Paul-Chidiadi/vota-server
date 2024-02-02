import { Response, NextFunction } from "express";
import { body, check } from "express-validator";

export const voteEventValidationRules = () => {
  return [
    body("candidateId")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Candidate Id can not be empty"),
    body("questionId")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Question Id can not be empty"),
  ];
};
