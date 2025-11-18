import Notification from "../models/Notification.js";

export const createNotif = async (req, res) => {
  const notif = await Notification.create(req.body);
  res.json(notif);
};

export const getNotifs = async (req, res) => {
  const notif = await Notification.find({ userId: req.params.userId });
  res.json(notif);
};
