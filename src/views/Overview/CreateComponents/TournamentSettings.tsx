import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckBox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import { ALL_TEAM_RATINGS } from "definitions/Definitions";
import { getStarsRender } from "definitions/TableDefinitions";

export interface Props {
  handleRatingSelectionChange: (e: any) => void;
  ratings: string[];
  includeSecondRound: boolean;
  handleIncludeChanged: (e: any) => void;
}
const TournamentSettings: React.FC<Props> = ({
  ratings,
  handleRatingSelectionChange,
  includeSecondRound,
  handleIncludeChanged,
}) => {
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
            Select Team Rating
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={ratings}
            onChange={handleRatingSelectionChange}
            renderValue={(selected: any) => selected.join(", ")}
          >
            {ALL_TEAM_RATINGS.map((r) => {
              return (
                <MenuItem key={r} value={r}>
                  <CheckBox checked={ratings.indexOf(r) > -1} color="primary" />
                  {getStarsRender(r)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControlLabel
          style={{ marginTop: "10px" }}
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
  );
};

export default TournamentSettings;
