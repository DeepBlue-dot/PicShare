import { body, validationResult } from "express-validator";

export const validateCreateBoard = [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Board name is required")
      .isLength({ min: 3 })
      .withMessage("Board name must be at least 3 characters")
      .isLength({ max: 50 })
      .withMessage("Board name cannot exceed 50 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("privacy")
      .optional()
      .isIn(["public", "private"])
      .withMessage("Privacy must be either public or private"),
    body("tags")
      .optional()
      .isArray({ max: 10 })
      .withMessage("Cannot have more than 10 tags")
      .custom((tags) => tags.every((tag) => typeof tag === "string"))
      .withMessage("All tags must be strings"),
    body("coverImage")
      .optional()
      .isString()
      .withMessage("Cover image must be a string URL"),
  ];