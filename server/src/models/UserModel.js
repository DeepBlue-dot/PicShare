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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    profilePicture: { type: String, default: "https://res.cloudinary.com/dt5ul7aww/image/upload/v1739269736/cvgdfcqjdfjsdsdv01f6.jpg" },
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: "" },
    resetToken: { type: String, default: "" },
    resetTokenExpires: { type: Date, default: null },
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
    updatedAt: this.updatedAt,
    createdAt: this.createdAt,
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

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toggleSavePost = async function (postId) {
  const index = this.savedPosts.findIndex((id) => id.toString() === postId.toString());

  if (index !== -1) {
    this.savedPosts.splice(index, 1);
  } else {
    this.savedPosts.push(postId);
  }

  return await this.save();
};


userSchema.index({ username: 1, email: 1 });
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
