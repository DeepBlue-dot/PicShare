import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";

async function userLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await UserModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), // Convert days to milliseconds
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    data: {
      user: user.getMyProfile(),
    },
  });
}

async function verifyAccount(req, res) {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const user = await UserModel.findOneAndUpdate(
      { email: decoded.email },
      { isVerified: true },
      { new: true, runValidators: true }
    );

    if (!user) throw new AppError("Invalid token. Please log in again.", 401);

    res.status(200).json({
      status: "success",
      data: {
        user: user.getMyProfile(),
      },
    });
  } catch (error) {
    throw new AppError("Invalid token. Please log in again.", 401);
  }
}

async function userLogOut(req, res) {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
}

async function resetPasswordGenerator(req, res) {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) throw new AppError("Invalid email.", 401);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  await sendMail(
    "me@example.com",
    user.email,
    "Password Reset",
    `http://localhost:8080/api/auth/resetPassword/${token}`
  );

  res.status(200).json({
    status: "success",
    message: "rest token sent",
  });
}

async function resetPasswordHandler(req, res) {
  
}

export {
  userLogOut,
  userLogin,
  verifyAccount,
  resetPasswordHandler,
  resetPasswordGenerator,
};
