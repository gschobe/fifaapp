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
import {
  BrowserRouter as Router,
  // Route,
  // Routes,
  // Navigate,
} from "react-router-dom";

// core components
import Admin from "./layouts/Admin.js";

import "./assets/css/material-dashboard-react.css?v=1.10.0";
import { Provider } from "react-redux";
import store from "store/Store.ts";

ReactDOM.render(
  <Router>
    <Provider store={store}>
      {/* <Routes>
        <Route index element={<Admin />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes> */}
      <Admin />
    </Provider>
  </Router>,
  document.getElementById("root")
);
