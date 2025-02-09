import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import decodeJWT from "../utils/decodeJwt.js";

async function userLogin(req, res) {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
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
  const decoded = decodeJWT(req.params.token);

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

  const resetLink = `${process.env.FRONTEND_URL}/api/auth/resetPassword/${token}`;

  await sendMail(
    process.env.EMAIL_FROM,
    user.email,
    "Password Reset Request",
    "passwordReset",
    {
      name: user.username || user.email,
      resetLink: resetLink,
      company: "PicShare",
    }
  );

  // Send success response
  res.status(200).json({
    status: "success",
    message: "Password reset token sent to your email.",
  });
}

async function resetPasswordHandler(req, res) {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  const decoded = decodeJWT(token)

  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new AppError("Invalid token. Please log in again.", 401);
  }

  user.password = password;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully.",
  });
}

export {
  userLogOut,
  userLogin,
  verifyAccount,
  resetPasswordHandler,
  resetPasswordGenerator,
};
