import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
