import express from "express";
import { createPost, deletePost, getAllPosts, getPost, updatePost } from "../controllers/PostController.js";

const postRoutes = express.Router()

postRoutes.route("/").get(getAllPosts).post(createPost)
postRoutes.route("/:id").get(getPost).patch(updatePost).delete(deletePost)


export default postRoutes