import { body, param } from "express-validator";
import { validateRequest } from "../validateRequest.js";

export const getUserByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
    validateRequest
];

export const validateUserRegistration = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (!req.body.password) {
        throw new Error("Password is required");
      }
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("profilePicture").optional().isString(),
  validateRequest
];

export const validateUserUpdate = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  // Validate confirmPassword (optional, but required if password is provided)
  body("confirmPassword")
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (req.body.user.password && value !== req.body.user.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  // Validate profilePicture (optional)
  body("user.profilePicture").optional().isString(),

  validateRequest
];
