import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "./css/Sign.css";
import axios from "axios";
import { UserContext } from "./UserContext";

const url = "/user/signup";

function SignUp() {
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);

  const signUpRequest = async (event) => {
    event.preventDefault();
    const inputData = {
      name: event.target.name.value,
      username: event.target.username.value,
      password: event.target.password.value,
    };
    console.log(inputData);
    axios
      .post(url, inputData)
      .then((result) => {
        console.log(result);
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
        console.log("some error occured");
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
    <div className="signUp">
      <div className="sign__body">
        <div className="sign__header">
          <Link to="/" className="link">
            <h2>hedwig</h2>
          </Link>
        </div>
        <div className="sign__form">
          <form onSubmit={signUpRequest}>
            <input
              type="text"
              minLength="6"
              name="name"
              placeholder="Enter your Name"
            />
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
            <button type="submit">Sign Up</button>
            <button>Sign Up using Google</button>
          </form>
          <h5 className="sign__alternate">
            Already have an account?{" "}
            <Link to="/signin" className="sign__alternateAnch">
              Sign In
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
