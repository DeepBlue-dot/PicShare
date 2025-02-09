import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";

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
    verificationToken,
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

  if (!newUser || Object.keys(newUser).length === 0) {
    throw new AppError("No update data provided", 400);
  }
  const user = await UserModel.findById(req.user);

  const allowedUpdates = ["username", "email", "password"];
  const invalidFields = [];

  if (newUser.password || newUser.confirmPassword) {
    if (newUser.password !== newUser.confirmPassword) {
      throw new AppError("Passwords do not match.", 400);
    }
  }

  Object.keys(newUser).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      user[key] = newUser[key];
    } else if (key !== "confirmPassword") {
      invalidFields.push(key);
    }
  });

  if (req.file) {
    user.profilePicture = req.file.path;
  }

  if (invalidFields.length > 0) {
    throw new AppError(`Invalid properties: ${invalidFields.join(", ")}`, 400);
  }

  user.updatedAt = Date.now();

  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user: user.getMyProfile(),
    },
  });
}

async function deleteUser(req, res) {
  await UserModel.findByIdAndDelete(req.user);

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
