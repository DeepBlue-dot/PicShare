import express from "express";
import {
  userRegister,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/UserController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticateUser from "../middleware/authenticateUser.js";

const userRoutes = express.Router();

userRoutes.route("/").get(getAllUsers).post(asyncHandler(userRegister));
userRoutes.use("/me", asyncHandler(authenticateUser));
userRoutes.route("/me").get(asyncHandler(getUser)).patch(updateUser).delete(deleteUser);

userRoutes.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);


export default userRoutes;
