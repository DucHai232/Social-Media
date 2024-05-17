import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//Register a new User
export const registerUser = async (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new UserModel({
    username,
    password: hashedPassword,
    firstname,
    lastname,
  });

  try {
    const oldUser = await UserModel.findOne({ username });
    if (oldUser) {
      return res
        .status(401)
        .json({ success: false, message: "username is already registered" });
    }
    const user = await newUser.save();
    const token = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({ success: true, message: "Register Successfully", user, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Login a User

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        res.status(400).json({ success: false, message: "Wrong password" });
      } else {
        const token = jwt.sign(
          {
            username: user.username,
            id: user._id,
          },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res
          .status(200)
          .json({ success: true, message: "Login Successfully", user, token });
      }
    } else {
      res.status(404).json({ success: false, message: "User does not exits" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
