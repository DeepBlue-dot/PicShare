import express from "express";
import { userLogin, userLogOut, verifyAccount, resetPasswordGenerator, resetPasswordHandler } from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const authRoutes = express.Router()

authRoutes.route("/login").post(asyncHandler(userLogin))
authRoutes.route("/logout").get(asyncHandler(userLogOut))
authRoutes.route("/verify/:token").get(asyncHandler(verifyAccount))
authRoutes.route("/resetPassword").post(asyncHandler(resetPasswordGenerator))
authRoutes.route("/resetPassword/:token").post(asyncHandler(resetPasswordHandler))


export default authRoutes