import express from "express";
import {
  userRegister,
  deleteUser,
  getUser,
  updateUser,
  getUserById,
  savePost,
  getSavedPosts,
} from "../controllers/UserController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticateUser from "../middleware/authenticateUser.js";
import upload from "../config/multerConfig.js";
import {
  getUserByIdValidator,
  validateUserRegistration,
  validateUserUpdate,
} from "../middleware/Validators/userRoutesValidator.js";
import { PostValidator } from "../middleware/Validators/postRoutesValidator.js";

const userRoutes = express.Router();

userRoutes
  .route("/")
  .post(validateUserRegistration, asyncHandler(userRegister));

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
userRoutes
  .route("/me/saved-posts")
  .get(authenticateUser, asyncHandler(getSavedPosts));
userRoutes
  .route("/me/saved-posts/:postId")
  .post(authenticateUser, PostValidator, asyncHandler(savePost));

export default userRoutes;
