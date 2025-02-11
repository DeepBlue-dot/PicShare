import express from "express";
import {
  userRegister,
  deleteUser,
  getUser,
  updateUser,
  getUserById,
} from "../controllers/UserController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticateUser from "../middleware/authenticateUser.js";
import uploadMiddleware from "../config/multerConfig.js";
import {
  getUserByIdValidator,
  validateUserRegistration,
  validateUserUpdate,
} from "../middleware/Validators/userRoutesValidator.js";

const userRoutes = express.Router();
const upload = uploadMiddleware("profile_pictures");

userRoutes
  .route("/")
  .post(
    validateUserRegistration,
    asyncHandler(userRegister)
  );

userRoutes.use("/me", asyncHandler(authenticateUser));

userRoutes
  .route("/me")
  .get(asyncHandler(getUser))
  .patch(
    upload.single("profilePicture"),

    validateUserUpdate,
    asyncHandler(updateUser)
  )
  .delete(asyncHandler(deleteUser));

userRoutes.route("/:id").get(getUserByIdValidator, asyncHandler(getUserById));

export default userRoutes;
