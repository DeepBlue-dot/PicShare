import PostModel from "../models/PostModel.js";
import UserModel from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryUtils.js";
import mongoose from "mongoose";


export async function createPost(req, res) {
  const newPost = await PostModel.create({
    ...req.body,
    createdBy: req.user,
    imageUrl: "-",
  });
  const uploadResult = await uploadFileToCloudinary(req.file, newPost._id);
  newPost.imageUrl = uploadResult.secure_url;
  await newPost.save();
  res.status(201).json({
    status: "success",
    data: {
      post: newPost.getPostInfo(req.user),
    },
  });
}

export async function getAllPost(req, res) {
    const { title, tags, createdBy, sort: sortQuery, page: pageQuery, limit: limitQuery } = req.query;

    // Build filter object
    const filter = {};
    if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    if (tags) {
      const tagsArray = tags.split(',');
      filter.tags = { $all: tagsArray }; // Posts must contain all specified tags
    }
    if (createdBy) filter.createdBy = createdBy;

    // Pagination settings
    const page = parseInt(pageQuery, 10) || 1;
    const limit = parseInt(limitQuery, 10) || 10;
    const skip = (page - 1) * limit;

    // Sorting configuration
    let sort = {};
    if (sortQuery) {
      sort = sortQuery.split(',').reduce((acc, field) => {
        let sortOrder = 1;
        if (field.startsWith('-')) {
          sortOrder = -1;
          field = field.slice(1);
        }
        acc[field] = sortOrder;
        return acc;
      }, {});
    } else {
      sort = { createdAt: -1 }; // Default to newest first
    }

    // Aggregation pipeline
    const aggregationPipeline = [
      { $match: filter },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' }
        }
      },
      { $sort: sort },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                title: 1,
                description: 1,
                imageUrl: 1,
                createdBy: 1,
                likes: 1,
                comments: 1,
                tags: 1,
                createdAt: 1,
                updatedAt: 1,
                likesCount: 1,
                commentsCount: 1
              }
            }
          ],
          total: [
            { $count: 'count' }
          ]
        }
      }
    ];

    const [result] = await PostModel.aggregate(aggregationPipeline);
    const posts = result?.data || [];
    const total = result?.total[0]?.count || 0;

    res.status(200).json({
      status: "success",
      results: posts.length,
      total,
      page,
      limit,
      data: {
        posts: posts.map((post) => PostModel.hydrate(post).getPostInfo(req.user))
      }
    });
}

export async function getPostById(req, res) {
  const post = await PostModel.findById(req.params.id);
  if (!post) throw new AppError("Post not found", 400);
  res.status(200).json({
    status: "success",
    data: post.getPostInfo(req.user),
  });
}

export async function updatePost(req, res) {
  const post = await PostModel.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user,
    },
    { ...req.body }
  );

  if (!post) throw new AppError("can not update post.", 400);

  if (req.file) {
    const uploadResult = await uploadFileToCloudinary(req.file, post._id);
    post.imageUrl = uploadResult.secure_url;
    await post.save();
  }

  res.status(201).json({
    status: "success",
    data: {
      post: post.getPostInfo(req.user),
    },
  });
}

export async function deletePost(req, res) {
  const post = await PostModel.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user,
  });

  if (!post) throw new AppError("cant delete psot", 400);
  await deleteFileFromCloudinary(post.imageUrl);

  res.status(204).json({
    status: "success",
    data: null,
  });
}

export async function likePost(req, res) {
  const post = await PostModel.findById(req.params.postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  await post.toggleLike(req.user);

  res.status(200).json({
    status: "success",
    data: {
      post: post.getPostInfo(req.user),
    },
  });
}

export async function getComments(req, res) {
  const post = await PostModel.findById(req.params.postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      comments: post.comments,
    },
  });
}

export async function addComment(req, res) {
  const post = await PostModel.findById(req.params.postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  const comments = (await post.addComment(req.body.text, req.user)).comments;

  res.status(200).json({
    status: "success",
    data: {
      comments: comments,
    },
  });
}

export async function deleteComment(req, res, next) {
  const post = await PostModel.findById(req.params.postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const commentIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === req.params.commentId
  );

  if (commentIndex === -1) {
    throw new AppError("Comment not found", 404);
  }

  const comment = post.comments[commentIndex];
  if (
    post.createdBy.toString() === req.user.toString() ||
    comment.commentedBy.toString() === req.user.toString()
  ) {
    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } else {
    throw new AppError("You are not authorized to delete this comment", 403);
  }
}

export async function editComment(req, res, next) {

    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (commentIndex === -1) {
      throw new AppError("Comment not found", 404);
    }

    const comment = post.comments[commentIndex];

    if (comment.commentedBy.toString() !== req.user.toString()) {
      throw new AppError("You are not authorized to edit this comment", 403);
    }

    post.comments[commentIndex].text = req.body.text; 
    await post.save();

    res.status(200).json({
      status: "success",
      data: {
        comments: post.comments[commentIndex], // Return the updated comment
      },
    });
}

export async function getUserComments(req, res) {
  const post = await PostModel.findById(req.params.postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      comments: post.findCommentByUser(req.user), // Return the updated comment
    },
  });

}

export async function getCommentsbyUser(req, res) {
  const post = await PostModel.findById(req.params.postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  const user = await UserModel.findById(req.params.userId);
  if (!user) {
    throw new AppError("user not found", 404);
  } 

  res.status(200).json({
    status: "success",
    data: {
      comments: post.findCommentByUser(user._id), 
    },
  });

}

export async function getPostsbyUser(req, res) {
  const user = await UserModel.findById(req.params.userId);
  if (!user) {
    throw new AppError("user not found", 404);
  } 

  let posts = await PostModel.find({createdBy: user._id})
  if(!posts) posts =[]

  res.status(200).json({
    status: "success",
    length: posts.length,
    data: {
      posts: posts.map((post)=>post.getPostInfo(req.user))
    },
  });
}

export async function getUserPosts(req, res) {
  let posts = await PostModel.find({createdBy: req.user})
  if(!posts) posts =[]

  res.status(200).json({
    status: "success",
    length: posts.length,
    data: {
      posts: posts.map((post)=>post.getPostInfo(req.user))
    },
  });
}

export async function searchPosts(req, res, next) {
    const { 
      search, 
      tags, 
      createdBy, 
      createdAtStart, 
      createdAtEnd, 
      sort 
    } = req.query;

    // Pagination parameters
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    // Build filter object
    const filter = {};

    // Search by title/description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by tags
    if (tags) {
      const tagsArray = tags.split(',');
      filter.tags = { $all: tagsArray };
    }

    // Filter by creator
    if (createdBy) {
      if (!mongoose.Types.ObjectId.isValid(createdBy)) {
        return next(new AppError('Invalid createdBy ID', 400, 'fail'));
      }
      filter.createdBy = new mongoose.Types.ObjectId(createdBy);
    }

    // Date range filter
    if (createdAtStart || createdAtEnd) {
      filter.createdAt = {};
      if (createdAtStart) {
        const startDate = new Date(createdAtStart);
        if (isNaN(startDate.getTime())) {
          return next(new AppError('Invalid createdAtStart date', 400, 'fail'));
        }
        filter.createdAt.$gte = startDate;
      }
      if (createdAtEnd) {
        const endDate = new Date(createdAtEnd);
        if (isNaN(endDate.getTime())) {
          return next(new AppError('Invalid createdAtEnd date', 400, 'fail'));
        }
        filter.createdAt.$lte = endDate;
      }
    }

    // Sorting criteria
    let sortCriteria = { createdAt: -1 };
    switch (sort) {
      case 'newest':
        sortCriteria = { createdAt: -1 };
        break;
      case 'oldest':
        sortCriteria = { createdAt: 1 };
        break;
      case 'most_liked':
        sortCriteria = { likesCount: -1 };
        break;
      case 'most_commented':
        sortCriteria = { commentsCount: -1 };
        break;
    }

    // Aggregation pipeline
    const aggregationPipeline = [
      { $match: filter },
      {
        $facet: {
          data: [
            {
              $addFields: {
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" }
              }
            },
            { $sort: sortCriteria },
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ],
          total: [{ $count: 'count' }]
        }
      },
      {
        $project: {
          data: 1,
          total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] }
        }
      }
    ];

    const [result] = await PostModel.aggregate(aggregationPipeline);
    const total = result.total;
    const posts = result.data;
    const totalPages = Math.ceil(total / limit);

    // Get user info if authenticated
    const userId = req.user?._id?.toString();
    const userSavedPosts = req.user?.savedPosts?.map(id => id.toString()) || [];

    // Format posts
    const formattedPosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      createdBy: post.createdBy,
      likes: {
        count: post.likesCount,
        liked: userId 
          ? post.likes.some(id => id.toString() === userId)
          : false
      },
      comments: {
        count: post.commentsCount,
        commented: userId
          ? post.comments.some(c => c.commentedBy.toString() === userId)
          : false
      },
      saved: userId
        ? userSavedPosts.includes(post._id.toString())
        : false,
      tags: post.tags || [],
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));

    res.status(200).json({
      status: 'success',
      results: formattedPosts.length,
      data: formattedPosts,
      page,
      limit,
      total,
      totalPages,
    });


}