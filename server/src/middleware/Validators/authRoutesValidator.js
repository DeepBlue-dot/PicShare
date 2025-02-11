import { body, param } from "express-validator";
import { validateRequest } from "../validateRequest.js";

export const userLoginValidator = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
];

export const verifyAccountValidator = [
  param("token").notEmpty(),
  validateRequest,
];

export const resetPasswordGeneratorValidator = [
  body("email").isEmail().withMessage("Invalid email format"),
  validateRequest,
];

export const resetPasswordHandlerValidator = [
  param("token").notEmpty(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom((value, { req }) => value === req.body.confirmPassword)
    .withMessage("Passwords do not match"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  validateRequest
];
