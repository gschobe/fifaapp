import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
} from "@mui/material";
import { ALL_TEAM_MODES, DartTournamentSettings } from "dart/Definitions";
import { Player } from "definitions/Definitions";
import React from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  tournamentSettings: DartTournamentSettings;
  setTournamentSettings: (settings: DartTournamentSettings) => void;
  playerValue: Player[];
  next: () => void;
  cancel: () => void;
}

const CreateTournamentDialog: React.FC<Props> = ({
  open,
  setOpen,
  playerValue,
  tournamentSettings,
  setTournamentSettings,
  next,
  cancel,
}) => {
  const [numTeams, setNumTeams] = React.useState("");
  const teamOptions = React.useMemo(() => {
    const numPlayers = playerValue.length;
    const options: number[] = [];
    if (numPlayers < 3) {
      return options;
    }
    const max = Math.ceil(numPlayers / 2);
    for (let i = max; i > 1; i--) {
      options.push(i);
    }

    return options;
  }, [playerValue]);
  return (
    <Dialog maxWidth={"xs"} fullWidth open={open}>
      <DialogTitle>Choose Tournament Settings</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: 6,
          }}
        >
          <div
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
                value={tournamentSettings.teamMode}
                onChange={(_event, value) => {
                  if (value) {
                    setTournamentSettings({
                      ...tournamentSettings,
                      teamMode: value,
                    });
                  }
                }}
              >
                {ALL_TEAM_MODES.map((mode) => (
                  <ToggleButton key={mode} value={mode}>
                    {mode}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
            {tournamentSettings.teamMode === "TEAM" && (
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
            <ToggleButton disabled value={"KO"}>
              KO MODE
            </ToggleButton>
          </ToggleButtonGroup>
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
          Next
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTournamentDialog;
