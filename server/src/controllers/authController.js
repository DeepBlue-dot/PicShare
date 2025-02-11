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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 
  });

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
    { email: decoded.email, verificationToken: req.params.token },
    { isVerified: true, verificationToken: "" },
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

  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();

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

  res.status(200).json({
    status: "success",
    message: "Password reset token sent to your email.",
  });
}

async function resetPasswordHandler(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  const decoded = decodeJWT(token);

  const user = await UserModel.findOne({
    _id: decoded.id,
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired token. Please log in again.", 401);
  }

  user.password = password;
  user.resetToken = "";
  user.resetTokenExpires = null;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully.",
  });
}

async function regenerateVerificationToken(req, res) {

  const user = await UserModel.findById(req.user);

  if (user.isVerified) {
    throw new AppError("User is already verified.", 400);
  }

  const newVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET
  );

  user.verificationToken = newVerificationToken;
  await user.save();

  const verificationLink = `${process.env.FRONTEND_URL}/api/auth/verify/${newVerificationToken}`;

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

  res.status(200).json({
    status: "success",
    message: "A new verification token has been sent to your email.",
  });
}

export {
  userLogOut,
  userLogin,
  verifyAccount,
  resetPasswordHandler,
  resetPasswordGenerator,
  regenerateVerificationToken
};
