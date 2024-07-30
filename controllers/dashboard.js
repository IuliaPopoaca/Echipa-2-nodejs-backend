const HttpError = require("../helpers/HttpError");
const controllerWrapper = require("../helpers/decorators");
const Dashboard = require("../models/dashboard");
const Column = require("../models/column");
const Card = require("../models/card");

async function getAll(req, res) {
  const { _id: owner } = req.user;
  const result = await Dashboard.find({ owner }, "-createdAt -updatedAt");
  res.json(result);
}

async function getById(req, res) {
  const { dashboardId } = req.params;
  const dashboard = await Dashboard.findById(dashboardId);
  if (!dashboard) {
    return res.status(404).json({ message: "Dashboard not found" });
  }

  const columns = await Column.find({ owner: dashboard._id });
  if (columns.length > 0) {
    const columnsWithOwnCards = await Column.aggregate([
      {
        $match: { $or: columns.map((column) => ({ _id: column._id })) },
      },
      {
        $lookup: {
          from: "cards",
          localField: "_id",
          foreignField: "owner",
          as: "cards",
        },
      },
    ]);

    return res.json({
      dashboard,
      columns: columnsWithOwnCards,
    });
  }

  // This will now only execute if columns.length is 0
  res.json({
    dashboard,
    columns: [],
  });
}