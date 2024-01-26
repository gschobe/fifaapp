import { FormControl, FormGroup, InputLabel } from "@material-ui/core";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  // ToggleButton,
  // ToggleButtonGroup,
  Select,
  MenuItem,
} from "@mui/material";
import { Player } from "definitions/Definitions";
import React from "react";
import PlayerSelect from "views/Overview/CreateComponents/PlayerSelect";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  playerValue: Player[];
  location: string;
  setLocation: (location: string) => void;
  setPlayerValue: (players: Player[]) => void;
  next: () => void;
  cancel: () => void;
}

const CreateDartNightDialog: React.FC<Props> = ({
  open,
  setOpen,
  playerValue,
  setPlayerValue,
  location,
  setLocation,
  next,
  cancel,
}) => {
  const [playerOpen, setPlayerOpen] = React.useState(false);
  return (
    <Dialog maxWidth={"xs"} fullWidth open={open}>
      <DialogTitle>Choose Night Settings</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: 6,
          }}
        >
          <FormGroup>
            <PlayerSelect
              playerOpen={playerOpen}
              setPlayerOpen={setPlayerOpen}
              playerValue={playerValue}
              setPlayerValue={setPlayerValue}
            />
            <FormControl style={{ marginTop: "10px", width: "80%" }}>
              <InputLabel style={{ paddingLeft: "5px" }}>
                Select Location
              </InputLabel>
              <Select
                onChange={(event) => setLocation(event.target.value)}
                value={location}
              >
                {playerValue
                  ? playerValue.map((p) => {
                      if (p) {
                        return (
                          <MenuItem key={p.name} value={p.name}>
                            {p.name}
                          </MenuItem>
                        );
                      }
                    })
                  : []}
              </Select>
            </FormControl>
          </FormGroup>
          {/* <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              columnGap: 20,
            }}
          >
            <div style={{ flex: 1, maxWidth: "60%" }}>
              <ToggleButtonGroup
                fullWidth
                color="primary"
                exclusive
                value={playerMode}
                onChange={(_event, value) => {
                  if (value) {
                    setPlayerMode(value);
                  }
                }}
              >
                <ToggleButton value={"SINGLE"}>SINGLE</ToggleButton>
                <ToggleButton disabled={playerValue.length < 3} value={"TEAM"}>
                  TEAM
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            {playerMode === "TEAM" && (
              <div
                style={{
                  flex: 0.5,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 5,
                }}
              >
                Teams:
                <Select
                  value={numTeams}
                  size="small"
                  onChange={(event) => setNumTeams(event.target.value)}
                >
                  {teamOptions.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}
          </div>
          <ToggleButtonGroup
            fullWidth
            color="primary"
            exclusive
            value={tournamentSettings.mode}
            onChange={(_event, value) => {
              if (value) {
                setTournamentSettings({ ...tournamentSettings, mode: value });
              }
            }}
          >
            <ToggleButton value={"LEAGUE"}>LEAGUE MODE</ToggleButton>
            <ToggleButton value={"KO"}>KO MODE</ToggleButton>
          </ToggleButtonGroup> */}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            cancel();
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={playerValue.length < 3}
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(false);
            next();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDartNightDialog;
