import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/UserController.js";
import { userRegister } from "../controllers/authController.js";

const userRoutes = express.Router();

userRoutes.route("/").get(getAllUsers).post(userRegister);
userRoutes.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRoutes;
