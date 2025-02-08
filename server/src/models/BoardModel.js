import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Board name must be at least 3 characters long."],
      maxlength: [50, "Board name cannot exceed 50 characters."],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters."],
    },
    coverImage: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    tags: {
      type: [String],
      validate: {
        validator: (tags) => tags.length <= 10,
        message: "A board cannot have more than 10 tags.",
      },
    },
  },
  {
    timestamps: true, 
  }
);

boardSchema.methods.addPost = function (postId) {
  if (!this.posts.includes(postId)) {
    this.posts.push(postId);
  }
  return this.save();
};

boardSchema.methods.removePost = function (postId) {
  this.posts = this.posts.filter((id) => id.toString() !== postId.toString());
  return this.save();
};

boardSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

boardSchema.post("save", function (error, doc, next) {
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

boardSchema.index({ createdBy: 1 });
boardSchema.index({ name: 1 });

const BoardModel = mongoose.model("Board", boardSchema);

export default BoardModel;
