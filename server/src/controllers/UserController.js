import UserModel from "../models/UserModel.js";

async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find();
    res.json({
      status: "success",
      results: users.length,
      data: {
        users: users,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
}

async function createUser(req, res) {
  try {
    const user = req.body.user;
    const newUser = await UserModel.create(user);
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
}

async function getUser(req, res) {
  try {
    const user = await UserModel.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
}

async function updateUser(req, res) {
  try {
    const newUser = req.body.user;
    const user = await UserModel.findByIdAndUpdate(req.params.id, newUser, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
}

async function deleteUser(req, res) {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
}

export { getAllUsers, createUser, getUser, updateUser, deleteUser };
