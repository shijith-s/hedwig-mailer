import React from "react";
import "./css/Mail.css";
import trash from "./css/trash-alt-solid.svg";
import axios from "axios";

const deleting_url = process.env.REACT_APP_BASE_URL + "/user/mails/delete/";

const weakdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const setTimeFormat = (timestamp) => {
  let time = new Date(timestamp);
  let date = time.getDate();
  let month = time.getMonth();
  let year = time.getFullYear();
  let hour = ("0" + time.getHours()).slice(-2);
  let min = ("0" + time.getMinutes()).slice(-2);
  return `${date}/${month}/${year} \u00A0\u00A0 ${hour}:${min}`;
};

const setScheduleText = (scheduleType, cronschedule) => {
  switch (scheduleType) {
    case "recurring": {
      console.log(cronschedule.split(" "));
      let min = cronschedule.split(" ")[0];
      let hour = cronschedule.split(" ")[1];
      if (min === "*") {
        return `Every ${hour.slice(2)} hours`;
      } else {
        return `Every ${min.slice(2)} minutes`;
      }
    }
    case "weekly": {
      let min = ("0" + cronschedule.split(" ")[0]).slice(-2);
      let hour = ("0" + cronschedule.split(" ")[1]).slice(-2);
      let day = Number(cronschedule.split(" ")[4]);
      return `Weekly on every ${weakdays[day]} at ${hour}:${min}`;
    }
    case "monthly": {
      let min = ("0" + cronschedule.split(" ")[0]).slice(-2);
      let hour = ("0" + cronschedule.split(" ")[1]).slice(-2);
      let date = Number(cronschedule.split(" ")[2]);
      return `Monthly on ${date} of every month at ${hour}:${min}`;
    }
    case "yearly": {
      let min = ("0" + cronschedule.split(" ")[0]).slice(-2);
      let hour = ("0" + cronschedule.split(" ")[1]).slice(-2);
      let date = Number(cronschedule.split(" ")[2]);
      let month = Number(cronschedule.split(" ")[3]);
      return `Yearly on ${date} of ${months[month]} at ${hour}:${min}`;
    }
    default:
      return " ";
  }
};

function Mail({ mail, setMails, allMails }) {
  // code for deleting a mail
  const deleteMail = () => {
    console.log("deleting this");
    const token = sessionStorage.getItem("token");
    const url = deleting_url + mail._id;
    console.log(url);

    // deleting that mail from the mails state
    let temp_mail = [...allMails];
    let index = temp_mail.findIndex((m) => m._id === mail._id);
    temp_mail.splice(index, 1);
    setMails(temp_mail);

    // sending delete request to delete a mail
    axios
      .delete(url, {
        headers: {
          authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mail">
      <h1 className="mail__title">{mail.title}</h1>
      <p className="mail__subject">Sub&nbsp;:&nbsp;{mail.subject}</p>
      <div className="mail_schedule">
        {setScheduleText(mail.scheduleType, mail.schedule)}
      </div>
      <div className="mail__footer">
        <p className="mail__time">Created : {setTimeFormat(mail.time)}</p>
        <img src={trash} alt="" className="mail__trash" onClick={deleteMail} />
      </div>
    </div>
  );
}

export default Mail;
