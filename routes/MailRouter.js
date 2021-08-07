const express = require("express");
const router = express.Router();
const registeredUser = require("../models/register");
const schedules = require("../models/Schedules");
const jwt = require("jsonwebtoken");
const verifyAuth = require("../middlewares/AuthVerifier");
const scheduler = require("../functional/scheduler");
const cronMaker = require("../functional/cron-maker");
const mongo = require("mongodb");
ObjectId = mongo.ObjectID;

router.post("/add", verifyAuth, async (req, res) => {
  const userID = req.userID;
  console.log(userID);
  try {
    // fetching the userinfo using the userID
    const user = await registeredUser.findById(userID);
    console.log(user);
    // passing mail data from request body to data variable
    const data = req.body;

    // creating an _id for the new mail so that we can access the _id for referring the mail
    let _id = new ObjectId();
    // stroing the _id inside the mailSchema
    data[`_id`] = _id;
    data.scheduleType = data.schedule.type;
    // converting the schedule passed from the client to cron expression
    data.schedule = cronMaker(data.schedule);

    // saving the mail data into the user database

    user.mails = [...user.mails, data];
    const saved = await user.save();
    console.log(saved);

    // sending data to schedule the job to scheduler function

    scheduler(userID, _id, data.schedule);

    console.log("passed scheduling");
    // adding the new mail to previous mails in the DB
    //saving the new mails
    console.log("mail saved");
    res.status(200).json("successfully saved mail");
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log("some error occured");
    console.log(err);
  }
});

router.get("/getall", verifyAuth, async (req, res) => {
  const userID = req.userID;
  console.log(userID);
  try {
    const user = await registeredUser.findById(userID);
    res.status(200).json({ mails: user.mails });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
});

router.delete("/delete/:id", verifyAuth, async (req, res) => {
  const userID = req.userID;
  const mailID = req.params.id;
  console.log("delete recieved");
  console.log(mailID);

  try {
    await registeredUser.updateOne(
      { _id: userID },
      { $pull: { mails: { _id: mailID } } }
    );
    await schedules.deleteOne({
      userID: userID,
      mailID: mailID,
    });
    console.log("successfully deleted the mail");
    res.status(200).json("successfully deleted");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
