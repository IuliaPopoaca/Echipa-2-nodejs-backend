const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const HttpError = require("../helpers/HttpError");
const sendEmail = require("../helpers/sendEmail");
const controllerWrapper = require("../helpers/decorators");

const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env;

function generateToken() {
  return crypto.randomBytes(32).toString("hex"); // Generează un string hex de 64 de caractere
}

async function register(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email is already in use" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = "";

  // Generate a confirmation token
  const confirmationToken = generateToken();

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarURL,
    confirmationToken,
  });

  // Build the confirmation link
  const confirmationLink = `http://localhost:5000/confirm?token=${confirmationToken}`;

  // Email data
  const emailData = {
    to: email,
    subject: "Registration Confirmation",
    text: `Welcome to our site! Please confirm your registration by clicking the following link: ${confirmationLink}`,
    html: `<p>Welcome to our site! Please confirm your registration by clicking the following link: <a href="${confirmationLink}">${confirmationLink}</a>.</p>`,
  };

  // Send the email
  try {
    await sendEmail(emailData);
    console.log("Confirmation email sent successfully.");
    res.status(201).json({
      email: newUser.email,
      message:
        "Registration successful! Please check your email to confirm your account.",
    });
  } catch (error) {
    console.error("Failed to send the confirmation email:", error);
    res.status(500).json({ message: "Failed to send confirmation email" });
  }
}