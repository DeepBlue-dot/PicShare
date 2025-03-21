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

postSchema.methods.getPostInfo = function (userId, userSavedPosts = []) {
  const liked = userId
    ? this.likes.some((like) => like.toString() === userId.toString())
    : false;
  const commented = userId
    ? this.comments.some(
        (comment) =>
          comment.commentedBy?.toString() === userId.toString()
      )
    : false;
  const saved = userId
    ? userSavedPosts.some(
        (postId) => postId.toString() === this._id.toString()
      )
    : false;

  return {
    id: this._id,
    title: this.title,
    description: this.description,
    imageUrl: this.imageUrl,
    createdBy: this.createdBy,
    likes: {
      count: this.likes.length,
      liked,
    },
    comments: {
      comments: this.comments,
      count: this.comments.length,
      commented,
    },
    saved,
    tags: this.tags || [],
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};


postSchema.methods.toggleLike = async function (userId) {
  const hasLiked = this.likes.some((id) => id.toString() === userId.toString());

  if (hasLiked) {
    this.likes = this.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    this.likes.push(userId);
  }

  await this.save();
};

postSchema.methods.addComment = async function (text, commentedBy) {
  if (this.comments.length >= 100) {
    throw new AppError('Maximum of 100 comments per post reached', 400);
  }
  this.comments.push({
    text,
    commentedBy,
  });

  return await this.save();
};

postSchema.methods.findCommentByUser = function (userId) {
  return this.comments.filter(
    (comment) => comment.commentedBy.toString() === userId.toString()
  );
};

postSchema.post("save", (error, doc, next) => {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const message = Object.keys(error.keyValue)
      .map((field) => `${field} already exists.`)
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
