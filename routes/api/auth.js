const express = require("express");
const {
  register,
  login,
  refresh,
  getCurrent,
  logout,
  updateTheme,
  updateProfile,
  getHelpEmail,
} = require("../../controllers/auth");

// const User = require("../../models/user");
const { confirmEmail } = require("../../controllers/auth");

const validateBody = require("../../middlewares/validateBody");
const authenticate = require("../../middlewares/authenticate");
const schemas = require("../../models/validation-schemas/user-validation");
const uploadCloud = require("../../middlewares/uploadMiddlewares");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), register);

// Route pentru confirmarea emailului
router.get("/confirm", async (req, res) => {
  try {
    const user = await confirmEmail(req.query.token);
    console.log(`User ${user.email} has been confirmed.`);
    res.send("Your account has been successfully confirmed!");
  } catch (error) {
    console.error(`Error confirming user: ${error}`);
    res.status(400).send(error.message);
  }
});