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
  unlikePost,
  updatePost,
} from "../controllers/PostController.js";
import authenticateUser from "../middleware/authenticateUser.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadMiddleware from "../config/multerConfig.js";

const upload = uploadMiddleware("posts")

const postRoutes = express.Router();

postRoutes
  .route("/")
  .get(asyncHandler(getAllPost))
  .post(asyncHandler(authenticateUser), asyncHandler(createPost));
postRoutes.route("/:id").get(getPostById).patch(updatePost).delete(deletePost);
postRoutes.route("/:postId/like").post(likePost).delete(unlikePost);
postRoutes.route("/:postId/comment").post(addComment).get(getComments);
postRoutes
  .route("/:postId/comment/:commentId")
  .delete(deleteComment)
  .patch(editComment);
postRoutes.route("/user/me").get(getUserPosts);
postRoutes.route("/user/me/saved-posts").get(getSavedPosts);
postRoutes.route("/user/:userId").get(getPostsbyUser);
postRoutes.route("search").get(searchPosts);

export default postRoutes;
