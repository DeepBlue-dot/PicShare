import { body, param } from "express-validator";
import { validateRequest } from "../validateRequest.js";

export const createPostValidator = [
  // Check if the image file is uploaded
  (req, res, next) => {
    if (!req.file) {
      throw Error("A post must have an image", 400);
    }
    next();
  },

  (req, res, next) => {
    if (req.body.comments || req.body.likes) {
      throw new Error("Cannot manually set comments or likes.", 400);
    }
    next();
  },

  // Validate the title
  body("title")
    .notEmpty()
    .withMessage("A post must have a title.")
    .isLength({ max: 100 })
    .withMessage("Title cannot be longer than 100 characters."),

  // Validate the description (optional)
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot be longer than 1000 characters."),

  // Validate the tags (optional)
  body("tags")
    .optional()
    .isArray({ max: 10 })
    .withMessage("A post cannot have more than 10 tags.")
    .custom((tags) => {
      if (tags) {
        return tags.every((tag) => typeof tag === "string" && tag.length <= 20);
      }
      return true;
    })
    .withMessage("Each tag must be a string and no longer than 20 characters."),

  validateRequest,
];
