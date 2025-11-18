import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  const msg = await Message.create(req.body);
  res.json(msg);
};

export const getMessages = async (req, res) => {
  const msgs = await Message.find({
    $or: [
      { from: req.user.id },
      { to: req.user.id }
    ]
  });
  res.json(msgs);
};
