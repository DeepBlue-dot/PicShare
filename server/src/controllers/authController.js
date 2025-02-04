import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";

async function userRegister(req, res, next) {
  if (req.body.user.password != req.body.user.confirmPassword) {
    throw new AppError("Passwords do not match.", 400, "failed");
  }
  const user = await UserModel.create(req.body.user);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
}

async function userLogin(req, res) {}

async function userLogOut(req, res) {}

export { userRegister, userLogOut, userLogin };
