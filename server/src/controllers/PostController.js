import PostModel from "../models/PostModel.js";
import AppError from "../utils/appError.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryUtils.js";

export async function createPost(req, res) {
  const newPost = await PostModel.create({
    ...req.body,
    createdBy: req.user,
    imageUrl: "-",
  });
  const uploadResult = await uploadFileToCloudinary(req.file, newPost._id);
  newPost.imageUrl = uploadResult.secure_url;
  await newPost.save();
  res.status(201).json({
    status: "success",
    data: {
      post: newPost.getPostInfo(req.user),
    },
  });
}

export async function getAllPost(req, res) {
  const posts = await PostModel.find()
  res.status(200).json({
    status: "success",
    length: users.length,
    data: {
      posts
    }
  })
}

export async function getPostById(req, res) {
  const post = await PostModel.findById(req.params.id);
  if (!post) throw new AppError("Post not found", 400);
  res.status(200).json({
    status: "success",
    data: post.getPostInfo(req.user),
  });
}

export async function updatePost(req, res) {
  const post = await PostModel.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user,
    },
    { ...req.body }
  );

  if (!post) new AppError("can not update post.", 400);

  if (req.file) {
    const uploadResult = await uploadFileToCloudinary(req.file, post._id);
    post.imageUrl = uploadResult.secure_url;
    await post.save();
  }

  res.status(201).json({
    status: "success",
    data: {
      post: post.getPostInfo(req.user),
    },
  });
}

export async function deletePost(req, res) {
  const post = await PostModel.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user,
  });

  if (!post) throw new AppError("cant delete psot", 400);
  await deleteFileFromCloudinary(post.imageUrl);

  res.status(204).json({
    status: "success",
    data: null,
  });
}

export async function likePost(req, res) {
  const post = await PostModel.findById(req.params.postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  await post.toggleLike(req.user)

  return res.status(200).json({
    status: "success",
    data: {
      post : post.getPostInfo(req.user)
    },
  });
}

export async function getComments(req, res) {}

export async function addComment(req, res) {}
export async function deleteComment(req, res) {}
export async function editComment(req, res) {}
export async function getPostsbyUser(req, res) {}
export async function getUserPosts(req, res) {}
export async function searchPosts(req, res) {}
export async function commentsforPost(req, res) {}
export async function savePost(req, res) {}
export async function unsavePost(req, res) {}
export async function getSavedPosts(req, res) {}
