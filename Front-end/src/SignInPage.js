import React from "react";
import "./css/SignInPage.css";
import { Link } from "react-router-dom";
function SignInPage() {
  return (
    <div className="signInPage">
      <div className="signInPage__header">
        <div className="signInPage__left">
          <div className="signInPage__logo"><h2>hedwig</h2></div>
        </div>
        <div className="signInPage__right">
          <Link to="/signin"><button className="signInPage__login">Sign In</button></Link>
          <Link to="/signup"><button className="signInPage__signUp">Sign Up</button></Link>
        </div>
      </div>
      <div className="signInPage__content">
        <h1>Hi there!</h1>
        <p>I will help you to store and send emails according to your schedule.</p>
      </div>
    </div>
  );
}

export default SignInPage;
