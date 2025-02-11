import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import cloudinary from "cloudinary";

async function getAllUsers(req, res) {
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

async function getUserById(req, res, next) {
  const user = UserModel.findById(req.params.id);
  if (!user) throw AppError("user not found", 400);

  res.status(201).json({
    status: "success",
    data: {
      user: user.getPublicProfile(),
    },
  });
}

async function getUser(req, res) {
  const user = await UserModel.findById(req.user);

  res.status(201).json({
    status: "success",
    data: {
      user: user.getMyProfile(),
    },
  });
}

async function userRegister(req, res, next) {
  const verificationToken = jwt.sign(
    { email: req.body.email },
    process.env.JWT_SECRET
  );

  const user = await UserModel.create({
    ...req.body,
    verificationToken: verificationToken,
  });

  const verificationLink = `${process.env.FRONTEND_URL}/api/auth/verify/${verificationToken}`;

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


async function updateUser(req, res) {
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

async function deleteUser(req, res) {
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

export {
  getUserById,
  getAllUsers,
  userRegister,
  getUser,
  updateUser,
  deleteUser,
};
