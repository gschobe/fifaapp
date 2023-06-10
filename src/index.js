/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";

// core components
import Admin from "./layouts/Admin.js";

import "./assets/css/material-dashboard-react.css?v=1.10.0";
import { Provider } from "react-redux";
import store from "store/Store.ts";
import UserProvider from "components/Login/UserProvider";
import DefaultDataProvider from "components/Login/DefaultDataProvider.tsx";

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <UserProvider>
        <DefaultDataProvider dispatch={store.dispatch}>
          <Admin auth={store.auth} />
        </DefaultDataProvider>
      </UserProvider>
    </Provider>
  </Router>,
  document.getElementById("root")
);
