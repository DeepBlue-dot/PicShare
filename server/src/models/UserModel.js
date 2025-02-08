import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import AppError from "../utils/appError.js";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, minlength: 3 },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: "Please provide a valid email",
      },
    },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.post("save", (error, doc, next) => {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const message = Object.keys(error.keyValue)
      .map((field) => `${field} already exists. Please use another value.`)
      .join(", \n");
    return next(new AppError(message, 400, "fail"));
  }

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((err) => err.message)
      .join(", \n");
    return next(new AppError(message, 400, "fail"));
  }

  next(error);
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.getMyProfile = function () {
  return {
    username: this.username,
    email: this.email,
    profilePicture: this.profilePicture,
    savedPosts: this.savedPosts,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

userSchema.methods.getPublicProfile = function () {
  return {
    username: this.username,
    email: this.email,
    profilePicture: this.profilePicture,
    savedPosts: this.savedPosts,
  };
};

// Indexes for faster queries
userSchema.index({ username: 1, email: 1 });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
