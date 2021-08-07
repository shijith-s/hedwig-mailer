const schedules = require("../models/Schedules");
const registeredUser = require("../models/register");
const cronParser = require("cron-parser");
const sendMail = require("./mailer");

const scheduleChecker = async () => {
  console.log("checking for schedules");
  let scheduleData = await schedules
    .findOne({ executeOn: { $lte: new Date() } })
    .limit(1);

  if (!scheduleData) {
    setTimeout(() => {
      scheduleChecker();
    }, 60000);
    console.log("no schedules found");
  } else {
    console.log("something is scheduled");
    // console.log(scheduleData);
    let userID = scheduleData.userID;
    let mailID = scheduleData.mailID;
    console.log([userID, mailID]);
    try {
      let mail = await registeredUser.findOne(
        { _id: userID },
        { mails: { $elemMatch: { _id: mailID } } }
      );
      console.log("mail found");
      console.log(mail);

      // sending mail using the fetched data
      const mailInfo = {
        recipients: mail.mails[0].recipients,
        subject: mail.mails[0].subject,
        body: mail.mails[0].body,
      };
      console.log(mailInfo);
      sendMail(mailInfo);
      console.log("mail send");
    } catch (err) {
      console.log("mail not send");
      console.log(err);
    }

    let cronexp = scheduleData.cronExp;
    let schedule = cronParser.parseExpression(cronexp);
    let executeOn = schedule.next().toString();
    console.log(executeOn);
    scheduleData.executeOn = executeOn;
    await scheduleData.save();
    scheduleChecker();
  }
};

module.exports = scheduleChecker;
