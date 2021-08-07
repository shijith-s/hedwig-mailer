import { useEffect, useContext } from "react";
import SignInPage from "./SignInPage";
import "./css/App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import HomePage from "./HomePage";
import { UserContext } from "./UserContext";

function App() {
  const [state, dispatch] = useContext(UserContext);

  // const token = sessionStorage.getItem("token");
  // const id = sessionStorage.getItem("id");
  // const name = sessionStorage.getItem("name");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");
    const name = sessionStorage.getItem("name");
    dispatch({
      type: "ADD_USER",
      userID: id,
      name: name,
      token: token,
    });
    // console.log([id,name,token])
  }, []);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/signin">
            {!sessionStorage.getItem("token") ? (
              <SignIn />
            ) : (
              <Redirect to="/home" />
            )}
          </Route>
          <Route path="/signup">
            {!sessionStorage.getItem("token") ? (
              <SignUp />
            ) : (
              <Redirect to="/home" />
            )}
          </Route>
          <Route path="/home">
            {/* <HomePage /> */}
            {sessionStorage.getItem("token") ? (
              <HomePage />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/">
            {!sessionStorage.getItem("token") ? (
              <SignInPage />
            ) : (
              <Redirect to="/home" />
            )}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
