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
    .custom((tags) => {
      if (Array.isArray(tags) && tags.length < 10) {
        return tags.every((tag) => typeof tag === "string" && tag.length <= 20);
      } else if (typeof tags === "string") {
        return true
      }
      return false; // If not an array, fail validation
    })
    .withMessage("Each tag must be a string and no longer than 20 characters."),

  validateRequest,
];

export const getPostByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("post ID is required")
    .isMongoId()
    .withMessage("Invalid post ID"),
  validateRequest,
];

export const updatePostValidator = [
  (req, res, next) => {
    if ((!req.body || Object.keys(req.body).length === 0) && !req.file) {
      throw new Error("No update data provided");
    }
    next();
  },

  (req, res, next) => {
    const invalidProperties = ["comments", "likes", "createdBy", "imageUrl"];
    const invalidFields = Object.keys(req.body).filter((field) =>
      invalidProperties.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new Error(`Invalid properties: ${invalidFields.join(", ")}`);
    }
    next();
  },

  // Validate the title
  body("title")
    .optional()
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

export const PostValidator = [
  param("postId")
    .notEmpty()
    .withMessage("post ID is required")
    .isMongoId()
    .withMessage("Invalid post ID"),

  validateRequest,
];

export const addCommentValidator = [
  param("postId")
    .notEmpty()
    .withMessage("post ID is required")
    .isMongoId()
    .withMessage("Invalid post ID"),

  body("text")
    .trim()
    .notEmpty()
    .withMessage("A comment cant be empty.")
    .isLength({ max: 100 })
    .withMessage("comment cannot be longer than 100 characters."),

  validateRequest,
];

export const deleteCommentValidator = [
  param("postId")
    .notEmpty()
    .withMessage("post ID is required")
    .isMongoId()
    .withMessage("Invalid post ID"),

  param("commentId")
    .notEmpty()
    .withMessage("comment ID is required")
    .isMongoId()
    .withMessage("Invalid comment ID"),
  validateRequest,
];

export const updateCommentValidator = [
  param("postId")
    .notEmpty()
    .withMessage("post ID is required")
    .isMongoId()
    .withMessage("Invalid post ID"),
  validateRequest,

  param("commentId")
    .notEmpty()
    .withMessage("post ID is required")
    .isMongoId()
    .withMessage("Invalid post ID"),
  validateRequest,

  body("text")
    .trim()
    .notEmpty()
    .withMessage("A comment cant be empty.")
    .isLength({ max: 100 })
    .withMessage("comment cannot be longer than 100 characters."),

  validateRequest,
];

export const getCommentsbyUserValidator = [
  param("postId")
    .notEmpty()
    .withMessage("post ID is required")
    .isMongoId()
    .withMessage("Invalid post ID"),

  param("userId")
    .notEmpty()
    .withMessage("user ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),

  validateRequest,
];

export const getPostsbyUserValidator = [
  param("userId")
    .notEmpty()
    .withMessage("user ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),

  validateRequest,
];

