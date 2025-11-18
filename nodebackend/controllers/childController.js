import Child from "../models/child.js";

export const createChild = async (req, res) => {
  const child = await Child.create(req.body);
  res.json(child);
};

export const getChildren = async (req, res) => {
  const children = await Child.find();
  res.json(children);
};
