const HttpError = require("../helpers/HttpError");
const controllerWrapper = require("../helpers/decorators");
const Card = require("../models/card");

async function getById(req, res) {
  const { cardId } = req.params;
  const result = await Card.findById(cardId);
  if (!result) throw HttpError(404);
  res.json(result);
}

async function addNew(req, res) {
  const { columnId } = req.params;
  const result = await Card.create({
    ...req.body,
    owner: columnId,
  });
  res.status(201).json(result);
}