import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Print from "./pages/Print";
import Success from "./pages/Success";
import PrivateRoute from "./Components/PrivateRoute";
import UserContext from "./Context";
function App() {
  return (
    <UserContext>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <PrivateRoute path="/home" exact component={Home} />
          <PrivateRoute path="/order" exact component={Print} />
          <PrivateRoute path="/success" exact component={Success} />
          <PrivateRoute path="/print/:filePath" exact component={Print} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </UserContext>
  );
}

export default App;
