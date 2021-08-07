import React, { useState, useContext, useEffect } from "react";
import "./css/HomePage.css";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";
import NewMail from "./NewMail";
import axios from "axios";
import Mail from "./Mail";

function HomePage() {
  const [state, dispatch] = useContext(UserContext);
  const history = useHistory();
  const name = state.name;

  useEffect(() => {
    getAllMails();
  }, []);

  const logout = () => {
    sessionStorage.clear();
    dispatch({
      type: "REMOVE_USER",
    });
    history.push("/");
  };

  const [mails, setMails] = useState([]);
  const getAllMails = async () => {
    const url = process.env.REACT_APP_BASE_URL + "/user/mails/getall";
    const token = sessionStorage.getItem("token");
    await axios
      .get(url, {
        headers: {
          authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setMails(res.data.mails);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(mails);

  const show_MailForm = () => {
    let x = document.querySelector(".home__mailForm");
    x.style.display = "block";
  };
  return (
    <div className="home">
      <div className="home__header">
        <h2>hedwig</h2>
        <div className="home__headerRight">
          <h3>{`Hello ${name ? name : ""}`}</h3>
          <button className="home__logout" onClick={logout}>
            logout
          </button>
        </div>
      </div>
      <div className="home__mails">
        {mails.map((mail) => (
          <Mail mail={mail} setMails={setMails} allMails={mails} />
        ))}
      </div>
      <div className="home__mailForm">
        <NewMail getAllMails={getAllMails} />
      </div>
      <button className="home__newMail" onClick={show_MailForm}>
        Create New Mail
      </button>
    </div>
  );
}

export default HomePage;
