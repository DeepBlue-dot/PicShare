import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";

async function authenticateUser(req, res, next) {
  const jwtToken = req.cookies.jwt;

  if (!jwtToken)
    throw new AppError(
      "You are not logged in! Please log in to get access.",
      401
    );

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now()), // Expire immediately
        httpOnly: true,
      });
      throw new AppError("Invalid token. Please log in again.", 401);
    }
    req.user = decoded.id;
    next();
  } catch (error) {
    throw new AppError("Invalid token. Please log in again.", 401);
  }
}

export default authenticateUser;
