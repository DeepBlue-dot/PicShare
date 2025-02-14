import express from "express";
import {
  createBoard,
  getAllBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
  addPost,
  deletePost,
  getAllPosts,
  searchBoards,
  getBoardsbyUser,
  getUserBoards,
  addTags,
} from "../controllers/BoardController.js";
import { validateCreateBoard } from "../middleware/Validators/boardRoutesValidator.js";
import authenticateUser from "../middleware/authenticateUser.js";
const boardRoutes = express.Router();

// Board CRUD routes
boardRoutes.route("/").post(authenticateUser,validateCreateBoard,createBoard).get(getAllBoard);

boardRoutes
  .route("/:boardId")
  .get(getBoardById)
  .patch(updateBoard)
  .delete(deleteBoard);

// Post-related routes
boardRoutes.route("/:boardId/posts").post(addPost).get(getAllPosts);

boardRoutes.route("/:boardId/posts/:postId").delete(deletePost);

// Search and user-specific routes
boardRoutes.route("/search").get(searchBoards);
boardRoutes.route("/user/:userId").get(getBoardsbyUser);
boardRoutes.route("/me/boards").get(getUserBoards);

// Tag-related routes
boardRoutes.route("/:boardId/tags").patch(addTags);

export default boardRoutes;
