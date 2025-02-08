import { validationResult } from "express-validator";
import AppError from "../utils/appError.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return next(new AppError(errorMessages.join(", "), 400));
  }

  next();
};