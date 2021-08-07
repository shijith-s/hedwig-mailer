const nodemailer = require("nodemailer");
require("dotenv/config");

const mailID = process.env.MAIL_ID;
const password = process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: mailID,
    pass: password,
  },
});

const sendMail = async (data) => {
  console.log([mailID, password]);
  const message = {
    from: "shijith@gmail.com",
    to: data.recipients.join(),
    subject: data.subject,
    text: data.body,
  };

  try {
    await transporter.sendMail(message);
    console.log("mail send");
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMail;
