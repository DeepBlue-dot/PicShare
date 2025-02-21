import { body, param } from "express-validator";
import { validateRequest } from "../validateRequest.js";
import UserModel from "../..//models/UserModel.js";

export const getUserByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  validateRequest,
];

export const validateUserRegistration = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .custom(async (username) => {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        throw new Error("Username already exists.");
      }
      return true;
    }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error("Email already exists.");
      }
      return true;
    }),

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

  validateRequest,
];

const allowedFields = [
  "username",
  "email",
  "password",
  "confirmPassword",
  "oldPassword",
];

export const validateUserUpdate = [
  (req, res, next) => {
    if ((!req.body || Object.keys(req.body).length === 0) && !req.file) {
      throw new Error("No update data provided");
    }
    next();
  },

  (req, res, next) => {
    const invalidFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length > 0) {
      throw new Error(`Invalid properties: ${invalidFields.join(", ")}`);
    }
    next();
  },

  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .custom(async (username) => {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        throw new Error("Username already exists.");
      }
      return true;
    }),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error("Email already exists.");
      }
      return true;
    }),

  body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (value, { req }) => {
      const { oldPassword, confirmPassword } = req.body;

      if (value && (!oldPassword || !confirmPassword)) {
        throw new Error(
          "Old Password and Confirm Password are required when updating password"
        );
      }

      if (oldPassword) {
        const user = await UserModel.findById(req.user);
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
          throw new Error("Old Password is incorrect");
        }
      }

      if (confirmPassword && value !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
  validateRequest,
];
