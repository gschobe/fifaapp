import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "../assets/img/fifa-23-kylian-mbappe.jpg";
import logo from "../assets/img/EA_Sports.svg.png";
import Overview from "views/Overview/Overview";
import { Hidden, IconButton } from "@mui/material";
import Menu from "@material-ui/icons/Menu";
import Login from "components/Login/Login";

let ps;

const switchRoutes = (
  <Routes>
    <Route path="/" element={<Overview />} />
    <Route path="/fifaapp" element={<Overview />} />
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        if (prop.hasId) {
          return (
            <Route
              path={prop.path + "/:matchdayId"}
              element={prop.component}
              key={key}
            />
          );
        }
        return <Route path={prop.path} element={prop.component} key={key} />;
      }
      return null;
    })}
    <Route
      path="/admin"
      element={<Navigate to="/admin/matchday/1" replace />}
    />
  </Routes>
);

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  return (
    <>
      <div className={classes.wrapper}>
        <Login />
        <Sidebar
          routes={routes}
          logoText={"FIFA Manager"}
          logo={logo}
          image={bgImage}
          handleDrawerToggle={handleDrawerToggle}
          open={mobileOpen}
          color={"blue"}
          {...rest}
        />
        <div className={classes.mainPanel} ref={mainPanel}>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
            >
              <Menu />
            </IconButton>
          </Hidden>
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
          {/* {getRoute() ? <Footer /> : null} */}
          {/* <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          bgColor={color}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
        /> */}
        </div>
      </div>
    </>
  );
}
