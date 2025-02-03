import PostModel from "../models/PostModel.js";

async function getAllPosts(req, res) {
  try {
    const posts = await PostModel.find();
    res.json({
      status: "success",
      results: posts.length,
      data: {
        posts: posts,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error,
    });
  }
}

async function getPost(req, res) {
  try {
    const post = await PostModel.findById(req.params.id);
    res.json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
}

async function createPost(req, res) {
  try {
    const newPost = await PostModel.create(req.body.post);
    res.status(201).json({
      status: "success",
      data: {
        newPost,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
}

async function updatePost(req, res) {
  try {
    const newpost = await PostModel.findByIdAndUpdate(
      req.params.id,
      req.body.post,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        newpost,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
}

async function deletePost(req, res) {
  try {
    await PostModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
}

export { getAllPosts, getPost, createPost, updatePost, deletePost };
