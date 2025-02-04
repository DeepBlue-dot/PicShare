import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/UserController.js";
import { userRegister } from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const userRoutes = express.Router();

userRoutes.route("/").get(getAllUsers).post(asyncHandler(userRegister));
userRoutes.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRoutes;
