import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useUser } from "../Context";
function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useUser();

  return (
    <Route
      {...rest}
      render={(props) =>
        user !== null ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}

export default PrivateRoute;
