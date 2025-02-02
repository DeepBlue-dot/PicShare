import UserModel from "../models/UserModel.js";

async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find();
    res.json({
      status: "success",
      results: users.length,
      data: users
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" });
  }
}

async function createUser(req, res) {
    try {

    } catch
    
}

export {getAllUsers}
