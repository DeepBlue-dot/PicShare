import express from "express";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  editComment,
  getAllPost,
  getComments,
  getPostById,
  getPostsbyUser,
  getSavedPosts,
  getUserPosts,
  likePost,
  searchPosts,
  updatePost,
} from "../controllers/PostController.js";
import authenticateUser from "../middleware/authenticateUser.js";
import asyncHandler from "../utils/asyncHandler.js";
import upload from "../config/multerConfig.js";
import {
  createPostValidator,
  getPostByIdValidator,
  likePostValidator,
  updatePostValidator,
} from "../middleware/Validators/postRoutesValidator.js";

const postRoutes = express.Router();

postRoutes
  .route("/")
  .get(asyncHandler(getAllPost))
  .post(
    asyncHandler(authenticateUser),
    upload.single("postImage"),
    createPostValidator,
    asyncHandler(createPost)
  );

postRoutes
  .route("/:id")
  .get(getPostByIdValidator, getPostById)
  .patch(
    authenticateUser,
    upload.single("postImage"),
    updatePostValidator,
    updatePost
  )
  .delete(authenticateUser, getPostByIdValidator, deletePost);

postRoutes
  .route("/:postId/like")
  .post(authenticateUser, likePostValidator, likePost)

postRoutes
  .route("/:postId/comment")
  .post(authenticateUser, addComment)
  .get(authenticateUser, getComments);

postRoutes
  .route("/:postId/comment/:commentId")
  .delete(authenticateUser, deleteComment)
  .patch(authenticateUser, editComment);

postRoutes.route("/user/me").get(authenticateUser, getUserPosts);

postRoutes.route("/user/me/saved-posts").get(authenticateUser, getSavedPosts);

postRoutes.route("/user/:userId").get(authenticateUser, getPostsbyUser);

postRoutes.route("search").get(searchPosts);

export default postRoutes;
