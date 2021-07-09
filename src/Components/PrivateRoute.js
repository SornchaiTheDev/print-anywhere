import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

import { useCookies } from "react-cookie";
function PrivateRoute({ component: Component, ...rest }) {
  const [cookies] = useCookies(["_login"]);

  return (
    <Route
      {...rest}
      render={(props) =>
        cookies._login === "logined" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

export default PrivateRoute;
