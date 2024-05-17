import express from "express";
import {
  UnFollowUser,
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/UserController.js";
import authMiddleWare from "../MiddleWare/authMiddleWare.js";
const router = express.Router();
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", authMiddleWare, updateUser);
router.delete("/:id", authMiddleWare, deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", UnFollowUser);
export default router;
