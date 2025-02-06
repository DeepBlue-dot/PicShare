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
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) throw new AppError('Invalid email.', 401);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const resetLink = `http://localhost:8080/api/auth/resetPassword/${token}`;

    await sendMail(
      'fikaduyeabsira89@gmail.com',
      user.email, 
      'Password Reset Request', 
      'passwordReset', 
      {
        name: user.name || user.email, 
        resetLink: resetLink,
        company: 'PicShare', 
      }
    );

    // Send success response
    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to your email.',
    });

  } catch (error) {

    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message,
    });
  }
}

export default resetPasswordGenerator;
async function resetPasswordHandler(req, res) {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    throw new AppError("Please provide both password and confirm password.", 400);
  }
  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match.", 400);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Token has expired. Please request a new password reset.", 401);
    }
    throw new AppError("Invalid token. Please log in again.", 401);
  }

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
