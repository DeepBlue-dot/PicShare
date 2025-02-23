import axios from "axios";

class PostService {
  constructor() {
    // Set up the base URL for all post-related API calls
    this.api = axios.create({
      baseURL: "http://localhost:8080/api/posts",
      withCredentials: true,
    });
  }

  // Get all posts
  async getAllPosts() {
    const response = await this.api.get("/");
    return response.data;
  }

  // Create a new post (expects FormData if uploading an image)
  async createPost(formData) {
    const response = await this.api.post("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  // Get a post by its ID
  async getPostById(id) {
    const response = await this.api.get(`/${id}`);
    return response.data;
  }

  // Update a post (if sending a file, use FormData)
  async updatePost(id, updateData) {
    const headers =
      updateData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : {};
    const response = await this.api.patch(`/${id}`, updateData, { headers });
    return response.data;
  }

  // Delete a post by its ID
  async deletePost(id) {
    const response = await this.api.delete(`/${id}`);
    return response.data;
  }

  // Like a post
  async likePost(postId) {
    const response = await this.api.post(`/${postId}/like`);
    return response.data;
  }

  // Add a comment to a post
  async addComment(postId, commentData) {
    const response = await this.api.post(`/${postId}/comment`, commentData);
    return response.data;
  }

  // Get all comments for a post
  async getComments(postId) {
    const response = await this.api.get(`/${postId}/comment`);
    return response.data;
  }

  // Delete a comment from a post
  async deleteComment(postId, commentId) {
    const response = await this.api.delete(`/${postId}/comment/${commentId}`);
    return response.data;
  }

  // Update a comment on a post
  async updateComment(postId, commentId, commentData) {
    const response = await this.api.patch(
      `/${postId}/comment/${commentId}`,
      commentData
    );
    return response.data;
  }

  // Get posts created by the currently authenticated user
  async getUserPosts() {
    const response = await this.api.get("/user/me");
    return response.data;
  }

  // Get comments made by the current user on a specific post
  async getUserComments(postId) {
    const response = await this.api.get(`/user/me/comments/${postId}`);
    return response.data;
  }

  // Get posts by a specific user
  async getPostsByUser(userId) {
    const response = await this.api.get(`/user/${userId}`);
    return response.data;
  }

  // Get comments by a specific user on a given post
  async getCommentsByUser(userId, postId) {
    const response = await this.api.get(`/user/${userId}/comments/${postId}`);
    return response.data;
  }

  // Search posts based on query parameters
  async searchPosts(queryParams) {
    const response = await this.api.get("/search", { params: queryParams });
    return response.data;
  }
}

export default new PostService();
