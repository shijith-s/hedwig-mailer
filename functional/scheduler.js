const schedules = require("../models/Schedules");
const cronParser = require("cron-parser");

const submitTask = async (data) => {
  console.log("reached schedules db");
  schedules
    .create(data)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

const scheduler = async (userID, mailID, cronexp) => {
  let schedule = cronParser.parseExpression(cronexp);

  let executeOn = schedule.next().toString();
  console.log(executeOn);
  const data = {
    userID: userID,
    mailID: mailID,
    cronExp: cronexp,
    executeOn: executeOn,
  };
  submitTask(data);
  console.log("submitted data for adding to schedules db");
  return;
};

module.exports = scheduler;
