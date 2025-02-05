import express from "express";
import { userLogin, userLogOut } from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const authRoutes = express.Router()

authRoutes.route("/login").post(asyncHandler(userLogin))
authRoutes.route("/logout").get(asyncHandler(userLogOut))



export default authRoutes