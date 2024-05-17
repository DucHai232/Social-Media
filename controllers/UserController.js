import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//get a User
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json({ success: false, message: "No such user exits" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
//get all user
export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res
      .status(200)
      .json({ success: true, message: "Get All User Successfully", users });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

//update a user
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, currentUserAdminStatus, password } = req.body;

  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        success: true,
        message: "Updated User Successfully",
        user,
        token,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  } else {
    res.status(403).json({
      success: false,
      message: "Access Denied! you can only update own profile",
    });
  }
};

//delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { _id, currentUserAdminStatus } = req.body;
  if (_id === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res
        .status(200)
        .json({ success: true, message: "Delete User Successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  } else {
    res.status(403).json({
      success: false,
      message: "Access Denied! you can only delete own profile",
    });
  }
};

//Follow a User
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (id === _id) {
    res.status(403).json({ success: false, message: "Action forbidden" });
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);
      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { followings: id } });
        res.status(200).json({ success: true, message: "User followed" });
      } else {
        res.status(403).json({
          success: false,
          message: "You are already following this id",
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }
};

//UnFollow a User
export const UnFollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (id === _id) {
    res.status(403).json({ success: false, message: "Action forbidden" });
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);
      if (followUser.followers.includes(_id)) {
        await followUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { followings: id } });
        res.status(200).json({ success: true, message: "User Unfollowed" });
      } else {
        res
          .status(403)
          .json({ success: false, message: "User is not followed by you" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }
};
