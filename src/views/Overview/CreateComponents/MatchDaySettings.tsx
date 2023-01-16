import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import CheckBox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@material-ui/core/Box";
import {
  ALL_TOURNAMENT_MODES,
  Player,
  TournamentMode,
} from "definitions/Definitions";
import { Button } from "@material-ui/core";

export interface Props {
  playerName: string[];
  handleSelectionChange: (e: any) => void;
  handleModeChange: (e: any) => void;
  players: (Player | undefined)[];
  mode: TournamentMode | undefined;
  handleLocaitonSelectionChange: (e: any) => void;
}
const MatchDaySettings: React.FC<Props> = ({
  playerName,
  handleSelectionChange,
  players,
  handleModeChange,
  mode,
  handleLocaitonSelectionChange,
}) => {
  const [playerOpen, setPlayerOpen] = React.useState(false);
  const mode2on2error =
    mode === "2on2" && (playerName.length < 4 || playerName.length % 2 !== 0);
  const mode2on2oddError = mode === "2on2-odd" && playerName.length % 2 !== 1;
  return (
    <Box
      style={{
        border: "2px solid lightgrey",
        borderRadius: "10px",
      }}
    >
      <FormGroup style={{ marginLeft: "10px", marginBottom: "10px" }}>
        <FormControl style={{ marginTop: "10px", width: "80%" }}>
          <InputLabel style={{ paddingLeft: "5px" }}>
            Select Location
          </InputLabel>
          <Select onChange={handleLocaitonSelectionChange} defaultValue="">
            {players
              ? players.map((p) => {
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
        <FormControl style={{ marginTop: "10px", width: "80%" }}>
          <InputLabel style={{ paddingLeft: "5px" }}>Select Players</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            open={playerOpen}
            onClose={() => setPlayerOpen(false)}
            onOpen={() => setPlayerOpen(true)}
            value={playerName}
            onChange={handleSelectionChange}
            renderValue={(selected: any) => selected.join(", ")}
            error={playerName.length < 2 || mode2on2error || mode2on2oddError}
          >
            {players.map((p) => {
              if (p) {
                return (
                  <MenuItem key={p.name} value={p.name}>
                    <CheckBox
                      checked={playerName.indexOf(p.name) > -1}
                      color="primary"
                    />
                    <ListItemText primary={p.name} />
                  </MenuItem>
                );
              }
            })}
            <MenuItem>
              <Button
                onClick={() => setPlayerOpen(false)}
                color="primary"
                variant="contained"
              >
                CONFIRM
              </Button>
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ marginTop: "10px", width: "80%" }}>
          <InputLabel style={{ paddingLeft: "5px" }}>Mode</InputLabel>
          <Select
            error={mode === undefined}
            value={mode ? mode : ""}
            label="Mode"
            onChange={handleModeChange}
          >
            {ALL_TOURNAMENT_MODES.map((tm) => {
              return (
                <MenuItem key={tm} value={tm}>
                  <ListItemText primary={tm} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </FormGroup>
    </Box>
  );
};

export default MatchDaySettings;
