import { body, param } from "express-validator";

export const userLoginValidator = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const verifyAccountValidator = [param("token").notEmpty()];

export const resetPasswordGeneratorValidator = [
  body("email").isEmail().withMessage("Invalid email format"),
];

export const resetPasswordHandlerValidator = [
  param("token").notEmpty(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];
