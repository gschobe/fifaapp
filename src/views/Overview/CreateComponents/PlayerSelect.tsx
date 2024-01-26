import Button from "@material-ui/core/Button";
import CheckBox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ListItemText from "@mui/material/ListItemText";
import { DPlayer } from "dart/Definitions";
import { Player } from "definitions/Definitions";
import React from "react";

interface Props {
  playerOpen: boolean;
  setPlayerOpen: (open: boolean) => void;
  playerOptions: (Player | DPlayer | undefined)[];
  playerValue: (Player | DPlayer)[];
  setPlayerValue: (players: (Player | DPlayer)[]) => void;
  disabled?: boolean;
}
const PlayerSelect: React.FC<Props> = ({
  playerOpen,
  setPlayerOpen,
  playerValue,
  playerOptions,
  setPlayerValue,
  disabled = false,
}) => {
  console.log(playerOptions);
  const selected = playerValue.map((p) => p.name);
  const handleSelectionChange: (event: any) => void = (event) => {
    const {
      target: { value },
    } = event;
    const players: string[] =
      typeof value === "string" ? value.split(",") : value;
    console.log(value);
    setPlayerValue(
      players
        .filter((p) => !!p)
        .map((p) => {
          return {
            name: p,
          };
        })
    );
  };
  return (
    <FormControl style={{ width: "80%" }}>
      <InputLabel style={{ paddingLeft: "5px" }}>Select Players</InputLabel>
      <Select
        disabled={disabled}
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        open={playerOpen}
        onClose={() => setPlayerOpen(false)}
        onOpen={() => setPlayerOpen(true)}
        value={selected}
        onChange={handleSelectionChange}
        renderValue={(selected: any) => selected.join(", ")}
        // error={playerValue.length < 2 || mode2on2error || mode2on2oddError}
      >
        {playerOptions.map((p) => {
          if (p) {
            return (
              <MenuItem key={p.name} value={p.name}>
                <CheckBox
                  checked={selected.indexOf(p.name) > -1}
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
  );
};

export default PlayerSelect;
