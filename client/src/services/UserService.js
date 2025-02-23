// src/services/UserService.js
import axios from "axios";
import Cookies from "js-cookie";

const URL = "http://localhost:8080";

const UserService = {
  async getUser() {
      const { data } = await axios.get(`${URL}/api/users/me`, {
        withCredentials: true,
      });
      return data.data.user;
  },

  async getUserById(id) {
    const { data } = await axios.get(`${URL}/api/users/${id}`, {
      withCredentials: true,
    });
    return data.data.user;
},

  async toggleSavePost(postId) {
    console.log(postId)
      const response = await axios.post(`/me/saved-posts/${postId}`);
      return response.data;
  },

  async getSavedPosts() {
      const response = await axios.api.get("/me/saved-posts");
      return response.data;
  },

  async updateUser(updatedData) {
      const response = await axios.patch(`${URL}/api/users/me`, updatedData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data.user;
  },

  async deleteAccount() {
      await axios.delete(`${URL}/api/users/me`, {
        withCredentials: true,
      });
      Cookies.remove("jwt");
      return true;
  },
};

export default UserService;
