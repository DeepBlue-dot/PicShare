import express from "express";
import { userLogin, userLogOut, userRegister } from "../controllers/authController.js";

const authRoutes = express.Router()

authRoutes.route("/register").post(userRegister)
authRoutes.route("/login").post(userLogin)
authRoutes.route("/logout").get(userLogOut)



export default authRoutes