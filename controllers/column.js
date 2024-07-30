const HttpError = require("../helpers/HttpError");
const controllerWrapper = require("../helpers/decorators");
const Card = require("../models/card");
const Column = require("../models/column");

async function getById(req, res) {
  const { columnId } = req.params;
  const column = await Column.findById(columnId);
  if (!column) throw HttpError(404);
  const cards = await Card.find({ owner: column._id });
  if (!cards) throw HttpError(404);
  res.json({
    column,
    cards,
  });
}

async function addNew(req, res) {
  const { dashboardId } = req.params;
  const result = await Column.create({
    ...req.body,
    owner: dashboardId,
  });
  res.status(201).json(result);
}