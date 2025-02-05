import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";

async function getAllUsers(req, res) {
  const users= await (await UserModel.find()).map((user)=>user.getPublicProfile())

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
  if (req.body.user.password != req.body.user.confirmPassword) {
    throw new AppError("Passwords do not match.", 400, "failed");
  }
  const verificationToken = jwt.sign(
    { email: req.body.user.email },
    process.env.JWT_SECRET
  );

  await sendMail(
    "picshare@resend.dev", // FROM
    req.body.user.email, // TO
    "Verify Your Account", // SUBJECT
    `
    <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333;">Welcome to PicShare! 📸</h2>
      <p style="color: #555;">Thank you for signing up. Please verify your email address to activate your account.</p>
      <a href="http://localhost:8080/api/auth/verify/${verificationToken}" 
         style="display: inline-block; padding: 12px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
        Verify My Account
      </a>
      <p style="color: #555;">Or copy and paste this link into your browser:</p>
      <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; word-break: break-all;">
        http://localhost:8080/api/auth/verify/${verificationToken}
      </p>
      <p style="color: #777; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
    `
  );
  
  const user = await UserModel.create({ ...req.body.user, verificationToken });


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

export { getUserById, getAllUsers,userRegister, getUser, updateUser, deleteUser };
