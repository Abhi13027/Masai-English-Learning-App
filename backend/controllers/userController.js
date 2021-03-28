const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all the fields" });
  }

  // For Customized Error
  const userValidation = new User({ email, password });
  const errorValidation = userValidation.validateSync();

  if (errorValidation) {
    if (errorValidation.errors["email"]) {
      return res.status(400).json({ message: "Invalid Email Address" });
    }

    if (errorValidation.errors["password"]) {
      return res
        .status(400)
        .json({ message: "Password should be greater than 6 characters" });
    }
  }

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all the fields" });
  }

  // For Custom Error Validation
  const userValidation = new User({ name, email, password });
  const errorValidation = userValidation.validateSync();

  if (errorValidation) {
    if (errorValidation.errors["name"]) {
      return res
        .status(400)
        .json({ message: "Name should be greater than 2 letters" });
    }

    if (errorValidation.errors["email"]) {
      return res.status(400).json({ message: "Invalid Email Address" });
    }

    if (errorValidation.errors["password"]) {
      return res
        .status(400)
        .json({ message: "Password should be greater than 6 characters" });
    }
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user._id) {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Please provide all the user details" });
  }
});

module.exports = { authUser, registerUser, getUserProfile };
