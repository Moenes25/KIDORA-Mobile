import DailyReport from "../models/DailyReport.js";

export const addReport = async (req, res) => {
  const report = await DailyReport.create(req.body);
  res.json(report);
};

export const getReports = async (req, res) => {
  const reports = await DailyReport.find({ childId: req.params.childId });
  res.json(reports);
};
