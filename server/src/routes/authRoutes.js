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

const authRoutes = express.Router();

authRoutes.route("/login").post(userLoginValidator, asyncHandler(userLogin));

authRoutes.route("/logout").get(asyncHandler(userLogOut));

authRoutes
  .route("/verify/:token")
  .get(verifyAccountValidator, asyncHandler(verifyAccount));

authRoutes.route("/resetPassword").post(
  resetPasswordGeneratorValidator,

  asyncHandler(resetPasswordGenerator)
);

authRoutes
  .route("/resetPassword/:token")
  .post(resetPasswordHandlerValidator, asyncHandler(resetPasswordHandler));

export default authRoutes;
