import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import decodeJWT from "../utils/decodeJwt.js";

export default async function authenticateUser(req, res, next) {
  const jwtToken = req.cookies.jwt;

  if (!jwtToken)
    throw new AppError(
      "You are not logged in! Please log in to get access.",
      401
    );

    const decoded = decodeJWT(jwtToken)

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
}

