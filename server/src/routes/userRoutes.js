import express from "express";
import {
  userRegister,
  deleteUser,
  getUser,
  updateUser,
  getUserById,
  getAllUsers
} from "../controllers/UserController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticateUser from "../middleware/authenticateUser.js";
import upload from "../config/multerConfig.js";

const userRoutes = express.Router();

userRoutes.route("/").post(upload.single("profilePicture"), asyncHandler(userRegister)).get(asyncHandler(getAllUsers));
userRoutes.use("/me", asyncHandler(authenticateUser));
userRoutes.route("/me").get(asyncHandler(getUser)).patch(upload.single("profilePicture"), asyncHandler(updateUser)).delete(asyncHandler(deleteUser));

userRoutes.route("/:id").get(asyncHandler(getUserById));



export default userRoutes;
