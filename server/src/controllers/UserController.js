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

async function getUser(req, res) {
    const user = await UserModel.findById(req.user);
    
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
}

async function userRegister(req, res, next) {
  if (req.body.user.password != req.body.user.confirmPassword) {
    throw new AppError("Passwords do not match.", 400, "failed");
  }
  const user = await UserModel.create(req.body.user);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
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
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
}

export {userRegister, getAllUsers, getUser, updateUser, deleteUser };
