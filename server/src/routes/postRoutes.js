import express from "express";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  editComment,
  getAllPost,
  getComments,
  getCommentsbyUser,
  getPostById,
  getPostsbyUser,
  getSavedPosts,
  getUserComments,
  getUserPosts,
  likePost,
  searchPosts,
  updatePost,
} from "../controllers/PostController.js";
import authenticateUser from "../middleware/authenticateUser.js";
import asyncHandler from "../utils/asyncHandler.js";
import upload from "../config/multerConfig.js";
import {
  addCommentValidator,
  createPostValidator,
  getPostByIdValidator,
  PostValidator,
  updateCommentValidator,
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
  .post(authenticateUser, PostValidator, likePost);

postRoutes
  .route("/:postId/comment")
  .post(authenticateUser, addCommentValidator, addComment)
  .get(getComments);

postRoutes
  .route("/:postId/comment/:commentId")
  .delete(authenticateUser, deleteComment, deleteComment)
  .patch(authenticateUser, updateCommentValidator, editComment);

postRoutes.route("/user/me").get(authenticateUser, getUserPosts);

postRoutes.route("/user/me/comments").get(authenticateUser, getUserComments);

postRoutes.route("/user/me/saved-posts").get(authenticateUser, getSavedPosts);

postRoutes.route("/user/:userId").get(getPostsbyUser);

postRoutes.route("/user/:userId/comments").get(getCommentsbyUser);

postRoutes.route("search").get(searchPosts);

export default postRoutes;
