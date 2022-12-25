import { Avatar, Button, Dialog, Grid, Paper, TextField } from "@mui/material";
import LockOutlined from "@material-ui/icons/LockOutlined";
import React from "react";
import { Box } from "@mui/system";
import { authConnector, AuthProps } from "store/AuthRecucer";
import { setCookie } from "typescript-cookie";

export interface LoginProps {
  onSignIn: () => void;
}

const Login: React.FC<LoginProps & AuthProps> = ({ isLoggedIn, logIn }) => {
  const [username, setUsername] = React.useState();
  // const [password, setPassword] = React.useState();

  const [errortxt, setErrortxt] = React.useState("");

  const onUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };
  // const onPasswordChange = (event: any) => {
  //   setPassword(event.target.value);
  // };

  const onSignInClicked = () => {
    if (
      username &&
      username === "fifa" /*&& password && password === "fifa"*/
    ) {
      setCookie("username", username, { expires: 0.5 });
      logIn(username);
      setErrortxt("");
    } else {
      setErrortxt("Invalid username or password entered!");
    }
  };

  return (
    <Dialog open={!isLoggedIn} fullScreen transitionDuration={0}>
      <Box width={"100"} height="100%" alignSelf="center" marginTop="20vh">
        <Grid>
          <Paper
            elevation={10}
            style={{
              height: "fit-content",
              padding: 20,
              width: 280,
            }}
          >
            <Grid display="flex" flexDirection="column" alignItems="center">
              <Avatar style={{ backgroundColor: "#26c6da" }}>
                <LockOutlined />
              </Avatar>
              <h3>Sign IN</h3>
            </Grid>
            <TextField
              label="Username:"
              placeholder="Enter username"
              fullWidth
              variant="standard"
              required
              margin="dense"
              autoFocus
              onChange={onUsernameChange}
              onKeyDown={(event: any) => {
                if (event.keyCode === 13) {
                  onSignInClicked();
                }
              }}
            />
            {/* <TextField
              label="Password:"
              placeholder="Enter password"
              fullWidth
              variant="standard"
              type="password"
              required
              margin="dense"
              onChange={onPasswordChange}
              onKeyDown={(event: any) => {
                if (event.keyCode === 13) {
                  onSignInClicked();
                }
              }}
            /> */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ marginTop: 10 }}
              onClick={onSignInClicked}
              disabled={!username /*|| !password*/}
            >
              SIGN IN
            </Button>
            <div style={{ color: "red", marginTop: 20 }}>{errortxt}</div>
          </Paper>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default authConnector(Login);
