import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";

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
  if (req.body.user.password != req.body.user.confirmPassword) {
    throw new AppError("Passwords do not match.", 400, "failed");
  }
  const verificationToken = jwt.sign(
    { email: req.body.user.email },
    process.env.JWT_SECRET
  );
  const user = await UserModel.create({ ...req.body.user, verificationToken });

  await sendMail(
    "picshare@resend.dev", // FROM
    user.email, // TO
    "Verify Your Account", // SUBJECT
    `<p>Please verify your email using this token: <strong>${verificationToken}</strong></p>` // HTML CONTENT
  );

  res.status(201).json({
    status: "success",
    data: {
      user: user.getPublicProfile(),
    },
  });
}

async function updateUser(req, res) {
  const newUser = req.body.user;

  if (!newUser || Object.keys(newUser).length === 0) {
    throw new AppError("No update data provided", 400);
  }
  const user = await UserModel.findById(req.user);

  const allowedUpdates = ["username", "email", "password", "profilePicture"];

  if (newUser.password || newUser.confirmPassword) {
    if (newUser.password !== newUser.confirmPassword) {
      throw new AppError("Passwords do not match.", 400);
    }
  }

  const invalidFields = [];

  Object.keys(newUser).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      user[key] = newUser[key];
    } else if (key != "confirmPassword") {
      invalidFields.push(key);
    }
  });

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

export { getUserById, userRegister, getUser, updateUser, deleteUser };
