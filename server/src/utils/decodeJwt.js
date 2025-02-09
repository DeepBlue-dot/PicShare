import AppError from "./appError.js";

export default function decodeJWT(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError("Token has expired. Please request a new one.", 401);
      }
      throw new AppError("Invalid token.", 401);
    }
  }
  