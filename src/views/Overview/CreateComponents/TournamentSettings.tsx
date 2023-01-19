import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckBox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import { ALL_TEAM_RATINGS } from "definitions/Definitions";
import { getStarsRender } from "definitions/TableDefinitions";
import MultiSelect from "./MutliSelect";
import Stack from "@mui/material/Stack";
import { Divider } from "@material-ui/core";

export interface Props {
  handleRatingSelectionChange: (e: any) => void;
  ratings: number[];
  includeSecondRound: boolean;
  handleIncludeChanged: (e: any) => void;
  reuseTeamsSelection: boolean;
  handleReuseTeamsSelection: (e: any) => void;
  lastTournamentExists: boolean;
  leagues: string[];
  selectedLeagues: string[];
  handleLeagueChange: (e: any) => void;
}
const TournamentSettings: React.FC<Props> = ({
  ratings,
  handleRatingSelectionChange,
  includeSecondRound,
  handleIncludeChanged,
  reuseTeamsSelection,
  handleReuseTeamsSelection,
  lastTournamentExists,
  leagues,
  selectedLeagues,
  handleLeagueChange,
}) => {
  const teamFilterError =
    !reuseTeamsSelection &&
    ratings.length === 0 &&
    selectedLeagues.length === 0;

  return (
    <>
      <Box
        style={{
          border: "2px solid lightgrey",
          borderRadius: "10px",
        }}
      >
        <FormGroup style={{ marginLeft: "10px", marginBottom: "10px" }}>
          <FormControlLabel
            style={{ marginTop: "5px" }}
            control={
              <CheckBox
                color="primary"
                checked={reuseTeamsSelection}
                onChange={handleReuseTeamsSelection}
                disabled={!lastTournamentExists}
              />
            }
            label="re-use team selection"
          />
          <MultiSelect
            disabled={reuseTeamsSelection}
            error={teamFilterError}
            value={ratings}
            labelText="Select Team Rating"
            menuItems={ALL_TEAM_RATINGS.map((r) => {
              return (
                <MenuItem key={r} value={r}>
                  <CheckBox checked={ratings.indexOf(r) > -1} color="primary" />
                  {getStarsRender(r, r, true)}
                </MenuItem>
              );
            })}
            onChange={handleRatingSelectionChange}
            renderValue={(selected) => {
              return (
                <Stack
                  key={`${selected}-stack`}
                  direction="row"
                  divider={
                    <Divider
                      key={`${selected}-divider`}
                      style={{ margin: "0 4px" }}
                      orientation="vertical"
                      flexItem
                    />
                  }
                >
                  {selected.map((s: number) => getStarsRender(s, s, true))}
                </Stack>
              );
            }}
          />
          <MultiSelect
            disabled={reuseTeamsSelection}
            error={teamFilterError}
            value={selectedLeagues}
            labelText="Select league"
            menuItems={leagues.map((l) => {
              return (
                <MenuItem key={l} value={l}>
                  <CheckBox
                    checked={selectedLeagues.indexOf(l) > -1}
                    color="primary"
                  />
                  {l}
                </MenuItem>
              );
            })}
            onChange={handleLeagueChange}
          />
        </FormGroup>
      </Box>
      <Box
        style={{
          border: "2px solid lightgrey",
          borderRadius: "10px",
          marginTop: "5pt",
        }}
      >
        <FormGroup style={{ marginLeft: "10px", marginBottom: "10px" }}>
          <FormControlLabel
            style={{ marginTop: "15px" }}
            control={
              <CheckBox
                color="primary"
                checked={includeSecondRound}
                onChange={handleIncludeChanged}
              />
            }
            label="including second round"
          />
        </FormGroup>
      </Box>
    </>
  );
};

export default TournamentSettings;
