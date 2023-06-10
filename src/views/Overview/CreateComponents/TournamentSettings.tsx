import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckBox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import { ALL_TEAM_RATINGS } from "definitions/Definitions";
import { getStarsRender, getStatRender } from "definitions/TableDefinitions";
import MultiSelect from "./MutliSelect";
import Stack from "@mui/material/Stack";
import { Divider } from "@material-ui/core";

export interface Props {
  numSelected: number;
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
  ova: number[];
  selectedOva: number[];
  handleOvaSelectionChange: (e: any) => void;
}
const TournamentSettings: React.FC<Props> = ({
  numSelected,
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
  ova,
  selectedOva,
  handleOvaSelectionChange,
}) => {
  const teamFilterError =
    !reuseTeamsSelection &&
    ratings.length === 0 &&
    selectedLeagues.length === 0 &&
    selectedOva.length === 0;

  return (
    <>
      <Box
        style={{
          border: "2px solid lightgrey",
          borderRadius: "10px",
          minWidth: "30vw",
        }}
      >
        <FormGroup
          style={{
            marginBottom: "10px",
            alignContent: "center",
          }}
        >
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
          <MultiSelect
            disabled={reuseTeamsSelection}
            error={teamFilterError}
            value={selectedOva}
            labelText="Select OVA"
            menuItems={ova.map((o) => {
              return (
                <MenuItem key={o} value={o}>
                  <CheckBox
                    checked={selectedOva.indexOf(o) > -1}
                    color="primary"
                  />
                  {getStatRender(o)}
                </MenuItem>
              );
            })}
            onChange={handleOvaSelectionChange}
          />
        </FormGroup>
        <div
          style={{
            width: "90%",
            margin: "15pt 0 5pt 0",
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
          }}
        >{`${numSelected} teams selected`}</div>
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
