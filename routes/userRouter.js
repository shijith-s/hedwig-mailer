const express = require("express");
// const register = require("../models/register");
const registeredUser = require("../models/register");
const schedules = require("../models/Schedules");
const router = express.Router();
const { registerValidator, loginValidator } = require("./validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const mailRouter = require("./MailRouter");

//registering router
router.post("/signup", async (req, res) => {
  //validating the data obtained from post request
  console.log(req.body);
  const { error } = registerValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Checking whether the username given is already taken or not
  const usernameExists = await registeredUser.findOne({
    username: req.body.username,
  });
  if (usernameExists) {
    return res.status(400).json({ message: "This Username already exists" });
  }
  //Encrypting the password
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new registeredUser({
    name: req.body.name,
    username: req.body.username,
    password: hashedPassword,
  });
  try {
    const saved = await user.save();
    console.log(saved);
    const token = jwt.sign({ _id: saved._id }, process.env.TOKEN_SECRET);
    res.json({ name: saved.name, jwtToken: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Login router
router.post("/login", async (req, res) => {
  //validating the data obtained from post request
  const { error } = loginValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Checking whether the user exists and collecting the stored info
  const storedUser = await registeredUser.findOne({
    username: req.body.username,
  });
  if (!storedUser) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  //checking the password
  const verified = await bcrypt.compare(req.body.password, storedUser.password);
  if (!verified) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ _id: storedUser._id }, process.env.TOKEN_SECRET);
  // res.cookie("jwtToken", token, { maxAge: 900000, httpOnly: true });
  res.status(200).json({ name: storedUser.name, jwtToken: token });
});

router.use("/mails", mailRouter);

//to delete all data in DB
router.delete("/deleteall", async (req, res) => {
  const deleted_users = await registeredUser.deleteMany({});
  const deleted_schedules = await schedules.deleteMany({});

  res.json({ users: deleted_users, schedules: deleted_schedules });
});

//to delete one user in DB
router.delete("/delete/:id", async (req, res) => {
  const deleted_user = await registeredUser.deleteOne({ _id: req.params.id });
  const deleted_schedule = await schedules.deleteOne({
    userID: req.params.id,
  });
  res.json({ user: deleted_user, schedule: deleted_schedule });
});

// to get all users in the DB
router.get("/getall", async (req, res) => {
  const allMails = await registeredUser.find({});
  res.json({ users: allMails });
});

// to get all schedules
router.get("/getallschedules", async (req, res) => {
  const allSchedules = await schedules.find({});
  res.json({ schedules: allSchedules });
});

module.exports = router;
