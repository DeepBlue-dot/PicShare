import mongoose from "mongoose";
import AppError from "../utils/appError.js";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A post must have a title."],
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: [true, "A post must have an image URL."],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A post must have a creator."],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: {
      type: [
        {
          text: { type: String, required: [true, "A comment must have text."] },
          commentedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "A comment must have a commenter."],
          },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      validate: {
        validator: function (comments) {
          return comments.length <= 100;
        },
        message: "A post cannot have more than 100 comments.",
      },
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags) {
          return tags.length <= 10;
        },
        message: "A post cannot have more than 10 tags.",
      },
    },
  },
  {
    timestamps: true,
  }
);

postSchema.post("save", (error, doc, next) => {
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

postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

postSchema.index({ createdBy: 1 });
postSchema.index({ board: 1 });
postSchema.index({ tags: 1 });
const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
