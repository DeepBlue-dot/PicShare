import { validationResult } from "express-validator";
import fs from "fs";

export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {

      const errorDetails = errors.array().reduce((acc, err) => {
        acc[err.path] = err.msg;
        return acc;
      }, {});

      return res.status(400).json({
        status: "fail",
        message: "Validation errors",
        errors: errorDetails,
      });
    
  }
  next();
}
