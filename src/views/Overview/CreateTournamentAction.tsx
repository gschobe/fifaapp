import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { storeConnector, StoreProps } from "store/StoreReducer";
import IconButton from "@material-ui/core/IconButton";
import AddBoxOutlined from "@material-ui/icons/AddBoxOutlined";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import DialogContent from "@material-ui/core/DialogContent";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckBox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { TournamentMode } from "definitions/Definitions";
import { DialogContentText } from "@mui/material";
// import DialogActions from "@material-ui/core/DialogActions";
const useStyles = makeStyles(styles);

const CreateTournamentAction: React.FC<StoreProps> = () => {
  const classes = useStyles();
  const [newTournamentOpen, setNewTournamentOpen] = React.useState(false);

  const handleNewTournamenClick: () => void = () => {
    setNewTournamentOpen((newTournamentOpen) => !newTournamentOpen);
  };

  const steps = [
    "Select tournament settings",
    "Select Players",
    "Select Teams",
    "Start draw",
  ];

  const [mode, setMode] = React.useState<TournamentMode>();
  const handleChange = (event: any) => {
    console.log(event.target.value);
    setMode("1on1");
  };
  return (
    <>
      <Dialog
        fullWidth
        open={newTournamentOpen}
        onClose={handleNewTournamenClick}
      >
        <DialogTitle>Create new tournament</DialogTitle>
        <DialogContentText style={{ paddingLeft: "20px" }}>
          Define your tournament settings.
        </DialogContentText>
        <DialogContent>
          <Box style={{ width: "100%" }}>
            <FormGroup>
              <FormControl>
                <InputLabel id="demo-simple-select-label">Mode</InputLabel>
                <Select
                  style={{ paddingTop: "5px" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={mode}
                  label="Mode"
                  onChange={handleChange}
                >
                  <MenuItem value={"1on1"}>1 on 1</MenuItem>
                  <MenuItem value={"2on2"}>2 on 2</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<CheckBox style={{ paddingTop: "20px" }} />}
                label="including second round"
              />
            </FormGroup>

            <Stepper activeStep={0} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogContent>
      </Dialog>
      <IconButton
        color="primary"
        aria-label="add player"
        className={classes.cardTitleWhite}
        onClick={handleNewTournamenClick}
      >
        <AddBoxOutlined />
      </IconButton>
    </>
  );
};

export default storeConnector(CreateTournamentAction);
