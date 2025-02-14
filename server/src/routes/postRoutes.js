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
  deleteCommentValidator,
  getCommentsbyUserValidator,
  getPostByIdValidator,
  getPostsbyUserValidator,
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
    asyncHandler(authenticateUser),
    upload.single("postImage"),
    updatePostValidator,
    asyncHandler(updatePost)
  )
  .delete(asyncHandler(authenticateUser), getPostByIdValidator, asyncHandler(deletePost));

postRoutes
  .route("/:postId/like")
  .post(asyncHandler(authenticateUser), PostValidator, asyncHandler(likePost));

postRoutes
  .route("/:postId/comment")
  .post(asyncHandler(authenticateUser), addCommentValidator, asyncHandler(addComment))
  .get(asyncHandler(getComments));

postRoutes
  .route("/:postId/comment/:commentId")
  .delete(asyncHandler(authenticateUser), deleteCommentValidator, asyncHandler(deleteComment))
  .patch(asyncHandler(authenticateUser), updateCommentValidator, asyncHandler(editComment));

postRoutes.route("/user/me").get(asyncHandler(authenticateUser), asyncHandler(getUserPosts));

postRoutes
  .route("/user/me/comments/:postId")
  .get(asyncHandler(authenticateUser), PostValidator, asyncHandler(getUserComments));

postRoutes
  .route("/user/:userId")
  .get(getPostsbyUserValidator, asyncHandler(getPostsbyUser));

postRoutes
  .route("/user/:userId/comments/:postId")
  .get(getCommentsbyUserValidator, asyncHandler(getCommentsbyUser));

postRoutes.route("/search").get(asyncHandler(searchPosts));

export default postRoutes;
