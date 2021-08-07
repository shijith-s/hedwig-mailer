import React, { useState } from "react";
import "./css/NewMail.css";
import axios from "axios";

const ValidateEmail = (email) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    return true;
  }
  alert("You have entered an invalid email address!\n" + email);
  return false;
};

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
const adding_url = "/user/mails/add";

function NewMail({ getAllMails }) {
  const [scheduleType, setScheduleType] = useState("");
  const [recurringFormat, setRecurringFormat] = useState("minutes");

  console.log(scheduleType);

  let options = "";
  switch (scheduleType) {
    case "recurring":
      options = (
        <RecurringHTML
          setRecurringFormat={setRecurringFormat}
          recurringFormat={recurringFormat}
        />
      );
      break;
    case "weekly":
      options = <WeeklyHTML />;
      break;
    case "monthly":
      options = <MonthlyHTML />;
      break;
    case "yearly":
      options = <YearlyHTML />;
      break;
    default:
      options = "";
  }

  const scheduleHandler = (event) => {
    switch (scheduleType) {
      case "recurring":
        let data1 = {
          type: "recurring",
          data: {
            timeFormat: recurringFormat,
            interval: event.target.interval.value,
          },
        };
        return data1;

      case "weekly":
        let data2 = {
          type: "weekly",
          data: {
            day: event.target.day.value,
            time: event.target.time.value,
          },
        };
        return data2;
      case "monthly":
        let data3 = {
          type: "monthly",
          data: {
            date: event.target.date.value,
            time: event.target.time.value,
          },
        };
        return data3;
      case "yearly":
        let data4 = {
          type: "yearly",
          data: {
            month: event.target.month.value,
            date: event.target.date.value,
            time: event.target.time.value,
          },
        };
        return data4;
      default:
        alert("Select a schedule");
        return false;
    }
  };

  const createMail = (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("token");
    const scheduleData = scheduleHandler(event);
    console.log("displaying scheduled data");
    console.log(scheduleData);
    let recipients = event.target.recipient.value.split("/");
    recipients.forEach((email) => {
      if (!ValidateEmail(email)) return;
    });
    if (!scheduleData) {
      alert("select a schedule");
      return;
    }
    const mailData = {
      title: event.target.title.value,
      subject: event.target.subject.value,
      recipients: event.target.recipient.value.split("/"),
      body: event.target.body.value,
      time: Date.now(),
      schedule: scheduleData,
    };
    console.log(mailData);
    axios
      .post(adding_url, mailData, {
        headers: {
          authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res);
        alert(res.data);
        hide_MailForm();
        getAllMails();
      });
  };

  // Showing and hiding the mail creation form.
  const hide_MailForm = () => {
    let x = document.querySelector(".home__mailForm");
    x.style.display = "none";
  };

  return (
    <div className="newMail">
      <div onClick={hide_MailForm} className="newMail__cross">
        &#10060;
      </div>
      <h2>Create a new Mail</h2>
      <form onSubmit={createMail} className="newMail__Form">
        <div className="newMail__options">
          <select
            name="schedule"
            onChange={(e) => {
              setScheduleType(e.target.value);
            }}
          >
            <option value="schedule" disabled selected>
              Select schedule
            </option>
            <option value="recurring">Recurring</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <div className="schedule__optionsPart">{options}</div>
        </div>
        <div className="newMail__formContent">
          <input
            type="text"
            name="title"
            placeholder="Enter the title"
            className="newMail__Title"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Enter the subject"
            className="newMail__Subject"
            required
          />
          <input
            type="text"
            name="recipient"
            placeholder="Enter the recipient email ids   (enter multiple email ids by separating them with '/')"
            className="newMail__Recipient"
            required
          />
          <textarea
            name="body"
            id=""
            cols="30"
            rows="10"
            placeholder="Enter the body of mail"
            className="newMail__body"
          />
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default NewMail;

const RecurringHTML = ({ setRecurringFormat, recurringFormat }) => (
  <div className="schedule__recurring schedule__options">
    <h3>Recurring Schedule</h3>

    <div>
      <h5>Interval:</h5>
      <input
        type="number"
        min="1"
        max={recurringFormat === "hours" ? "24" : "60"}
        size="2"
        maxLength="2"
        required
        name="interval"
      />
      <select
        name="timeFormat"
        onChange={(e) => {
          setRecurringFormat(e.target.value);
        }}
      >
        <option value="minutes" selected>
          Minutes
        </option>
        <option value="hours">Hours</option>
      </select>
    </div>
    {/* <h2>+</h2>
    <br />
    <div>
      <h5>Interval minutes:</h5>
      <input
        type="number"
        min="0"
        max="60"
        size="2"
        maxLength="2"
        required
        name="minutes"
      />
    </div> */}
  </div>
);

const WeeklyHTML = () => (
  <div className="schedule__weekly schedule__options">
    <h3>Weekly Schedule</h3>
    <div>
      <h5>week day:</h5>
      <select name="day" required>
        {weakdays.map((day, index) => (
          <option value={index}>{day}</option>
        ))}
      </select>
    </div>

    <div>
      <h5>Time:</h5>
      <div className="time">
        <input type="time" name="time" required />
      </div>
    </div>
  </div>
);

const MonthlyHTML = () => (
  <div className="schedule__monthly schedule__options">
    <h3>Monthly Schedule</h3>
    <div>
      <h5>Day of the month:</h5>
      <input type="number" min="0" max="31" name="date" required />
    </div>

    <div>
      <h5>Time:</h5>
      <div className="schedule__monthly__time ">
        <input type="time" name="time" required />
      </div>
    </div>
  </div>
);

const YearlyHTML = () => (
  <div className="schedule__yearly schedule__options">
    <h3>Yearly Schedule</h3>
    <div>
      <h5>Month of the year:</h5>
      <select name="month" required>
        {months.map((month, index) => (
          <option value={index + 1}>{month}</option>
        ))}
      </select>
    </div>
    <div>
      <h5>Day of the month:</h5>
      <input type="number" min="1" max="31" name="date" required />
    </div>

    <div>
      <h5>Time:</h5>
      <div className="schedule__monthly__time">
        <input type="time" name="time" required />
      </div>
    </div>
  </div>
);
