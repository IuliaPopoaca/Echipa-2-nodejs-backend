const express = require("express");
const { getAll, getById, addNew, updateById, removeById, updateCurrentDashboard } = require("../../controllers/dashboard");
const authenticate = require("../../middlewares/authenticate");
