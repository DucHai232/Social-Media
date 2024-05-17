import ChatModel from "../models/chatModel.js";

export const createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const result = await newChat.save();
    res
      .status(200)
      .json({ success: true, message: "Create chat successfully", result });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const userChat = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res
      .status(200)
      .json({ success: true, message: "Find Chat Successfully", chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
