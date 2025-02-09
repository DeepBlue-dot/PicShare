import express from "express";
import {
  userLogin,
  userLogOut,
  verifyAccount,
  resetPasswordGenerator,
  resetPasswordHandler,
} from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  resetPasswordGeneratorValidator,
  resetPasswordHandlerValidator,
  userLoginValidator,
  verifyAccountValidator,
} from "../middleware/Validators/authRoutesValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const authRoutes = express.Router();

authRoutes
  .route("/login")
  .post(userLoginValidator, validateRequest, asyncHandler(userLogin));

authRoutes.route("/logout").get(asyncHandler(userLogOut));

authRoutes
  .route("/verify/:token")
  .get(verifyAccountValidator, validateRequest, asyncHandler(verifyAccount));

authRoutes
  .route("/resetPassword")
  .post(
    resetPasswordGeneratorValidator,
    validateRequest,
    asyncHandler(resetPasswordGenerator)
  );

authRoutes
  .route("/resetPassword/:token")
  .post(resetPasswordHandlerValidator,validateRequest,asyncHandler(resetPasswordHandler));

export default authRoutes;
