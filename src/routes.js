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
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import HomeOutlined from "@material-ui/icons/HomeOutlined";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import Overview from "views/Overview/Overview.tsx";
import RoutingMatchday from "views/Matchday/RoutingMatchday";
import React from "react";
import TeamsPage from "views/Teams/TeamsPage";
import StatsPage from "views/Statistic/StatsPage";
// import DartOverview from "dart/DartOverview";
import DartHome from "dart/DartHome";
import RoutingDartNight from "dart/RoutingDartNight";
// import dartLogo from "./assets/img/dart.png";

const dashboardRoutes = [
  {
    path: "/overview",
    name: "Übersicht",
    rtlName: "لوحة القيادة",
    icon: HomeOutlined,
    component: <Overview />,
    layout: "/admin",
    showInSidebar: true,
  },
  {
    path: "/matchday",
    name: "Matchday",
    rtlName: "لوحة القيادة",
    icon: HomeOutlined,
    component: <RoutingMatchday />,
    layout: "/admin",
    showInSidebar: false,
    hasId: true,
  },
  {
    path: "/stats",
    name: "Statistics",
    icon: Dashboard,
    component: <StatsPage />,
    layout: "/admin",
    showInSidebar: true,
  },
  {
    path: "/teams",
    name: "Maintain Teams",
    icon: Groups2RoundedIcon,
    component: <TeamsPage />,
    layout: "/admin",
    showInSidebar: true,
  },
  {
    path: "/dart",
    name: "Overview",
    icon: HomeOutlined,
    component: <DartHome />,
    layout: "/admin",
    showInSidebar: true,
    group: "DART",
  },
  {
    path: "/dart/dartNight",
    name: "Dart Night",
    icon: Groups2RoundedIcon,
    component: <RoutingDartNight />,
    layout: "/admin",
    showInSidebar: false,
    hasId: true,
    group: "DART",
  },
];

export default dashboardRoutes;
