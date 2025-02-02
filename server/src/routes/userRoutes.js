import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/UserController.js";

const userRoutes = express.Router();

userRoutes.route("/").get(getAllUsers).post(createUser);
userRoutes.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRoutes;
