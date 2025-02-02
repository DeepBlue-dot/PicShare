import express from "express";
import { getAllUsers } from "../controllers/UserController.js";

const userRoutes = express.Router()
userRoutes.get('/', getAllUsers)

export default userRoutes;