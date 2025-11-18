import Payment from "../models/Payment.js";

export const addPayment = async (req, res) => {
  const pay = await Payment.create(req.body);
  res.json(pay);
};

export const getPayments = async (req, res) => {
  const pays = await Payment.find({ parentId: req.params.parentId });
  res.json(pays);
};
