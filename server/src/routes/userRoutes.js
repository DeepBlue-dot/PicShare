import express from "express";
import {
  userRegister,
  deleteUser,
  getUser,
  updateUser,
  getUserById
} from "../controllers/UserController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticateUser from "../middleware/authenticateUser.js";

const userRoutes = express.Router();

userRoutes.route("/").post(asyncHandler(userRegister));
userRoutes.use("/me", asyncHandler(authenticateUser));
userRoutes.route("/me").get(asyncHandler(getUser)).patch(asyncHandler(updateUser)).delete(asyncHandler(deleteUser));

userRoutes.route("/:id").get(asyncHandler(getUserById));


export default userRoutes;
