import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function userLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await UserModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), // Convert days to milliseconds
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
}

async function verifyAccount(params) {
  
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

export { userLogOut, userLogin };
