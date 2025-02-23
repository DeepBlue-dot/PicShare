import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../utils/cloudinaryUtils.js";

export async function getAllUsers(req, res) {
  const users = await (
    await UserModel.find()
  ).map((user) => user.getPublicProfile());

  res.status(200).json({
    status: "success",
    length: users.length,
    data: {
      users,
    },
  });
}

export async function getUserById(req, res, next) {
  const user = await UserModel.findById(req.params.id);
  if (!user) throw AppError("user not found", 400);

  res.status(201).json({
    status: "success",
    data: {
      user: user.getPublicProfile(),
    },
  });
}

export async function getUser(req, res) {
  const user = await UserModel.findById(req.user);

  res.status(201).json({
    status: "success",
    data: {
      user: user.getMyProfile(),
    },
  });
}

export async function userRegister(req, res, next) {
  const verificationToken = jwt.sign(
    { email: req.body.email },
    process.env.JWT_SECRET
  );

  const user = await UserModel.create({
    ...req.body,
    verificationToken: verificationToken,
  });

  const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

  await sendMail(
    process.env.EMAIL_FROM,
    user.email,
    "Verify Your Account",
    "accountVerification",
    {
      name: user.username || user.email,
      verificationLink: verificationLink,
      company: "PicShare",
    }
  );

  res.status(201).json({
    status: "success",
    data: {
      user: user.getPublicProfile(),
    },
  });
}

export async function updateUser(req, res) {
  const newUser = req.body;
  const user = await UserModel.findById(req.user);

  // Update user properties
  Object.keys(newUser).forEach((key) => {
    if (newUser[key] !== undefined) {
      user[key] = newUser[key];
    }
  });

  if (req.file) {
    const publicId = `${user._id}`;
    await deleteFileFromCloudinary(user.profilePicture);
    const uploadResult = await uploadFileToCloudinary(req.file, publicId);
    user.profilePicture = uploadResult.secure_url;
  }

  user.updatedAt = Date.now();
  await user.save();

  // Return updated user data
  res.status(200).json({
    status: "success",
    data: {
      user: user.getMyProfile(),
    },
  });
}

export async function deleteUser(req, res) {
  const user = await UserModel.findByIdAndDelete(req.user);
  await deleteFileFromCloudinary(user.profilePicture);

  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() - 1000),
    httpOnly: true,
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
}

export async function savePost(req, res) {
  const user = await UserModel.findById(req.user);
  const post = await PostModel.findById(req.params.postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  await user.toggleSavePost(post._id);

  res.status(200).json({
    status: "success",
    message: {
      post: post.getPostInfo(req.user)
    },
  });
}

export async function getSavedPosts(req, res) {
    const user = await UserModel.findById(req.user).populate("savedPosts");

    res.status(200).json({
      status: "success",
      length: user.savedPosts.length,
      data: { savedPosts: (user.savedPosts).map((post)=>post.getPostInfo(req.user)) },
    });
}


