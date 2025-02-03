import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema({
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
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
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

// Indexes for faster queries
userSchema.index({ username: 1, email: 1 });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
