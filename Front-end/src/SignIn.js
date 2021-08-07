import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "./css/Sign.css";
import axios from "axios";
import { UserContext } from "./UserContext";

const url = "/user/login";

function SignIn() {
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);

  const signInRequest = async (event) => {
    event.preventDefault();
    const inputData = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
    axios
      .post(url, inputData)
      .then((result) => {
        sessionStorage.setItem("token", result.data.jwtToken);
        sessionStorage.setItem("name", result.data.name);
        // sessionStorage.setItem("id", result.data.id);

        dispatch({
          type: "ADD_USER",
          // userID: result.data.id,
          name: result.data.name,
          token: result.data.jwtToken,
        });
        history.push("/home");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        alert(err.response.data.message);
      });
  };

  const pwdShowHide = (event) => {
    console.log("checkbox clicked");
    console.log(event.target.checked);
    if (event.target.checked) {
      document.querySelector(".login__password").type = "text";
    } else {
      document.querySelector(".login__password").type = "password";
    }
  };

  return (
    <div className="signIn">
      <div className="sign__body">
        <div className="sign__header">
          <Link to="/" className="link">
            <h2>hedwig</h2>
          </Link>
        </div>
        <div className="sign__form">
          <form onSubmit={signInRequest}>
            <input
              type="text"
              minLength="6"
              name="username"
              placeholder=" Username"
            />
            <input
              type="password"
              minLength="6"
              name="password"
              placeholder="Password"
              className="login__password"
            />
            <div className="pwdCheckbox">
              <input
                type="checkbox"
                name="pwdCheck"
                value={true}
                onClick={pwdShowHide}
                id="pwdCheck"
                className="pwdCheck"
              />
              <label for="pwdCheck">Show password</label>
            </div>
            <button type="submit">Sign In</button>
            <button>Sign In using Google</button>
          </form>
          <h5 className="sign__alternate">
            Don't have an account?{" "}
            <Link to="/signup" className="sign__alternateAnch">
              Sign Up
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
