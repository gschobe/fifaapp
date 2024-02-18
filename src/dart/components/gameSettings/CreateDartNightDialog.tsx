import { FormControl, FormGroup, InputLabel } from "@material-ui/core";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  // ToggleButton,
  // ToggleButtonGroup,
  Select,
} from "@mui/material";
import { DPlayer } from "dart/Definitions";
import React from "react";
import { DartStoreProps, dartConnector } from "store/DartStore";
import PlayerSelect from "views/Overview/CreateComponents/PlayerSelect";

interface Props extends DartStoreProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  playerValue: DPlayer[];
  location: string;
  setLocation: (location: string) => void;
  setPlayerValue: (players: DPlayer[]) => void;
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
  dPlayers,
}) => {
  const [playerOpen, setPlayerOpen] = React.useState(false);
  const playerOptions = React.useMemo(() => {
    return Object.values(dPlayers);
  }, [dPlayers]);
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
              playerOptions={playerOptions}
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
          disabled={playerValue.length < 2}
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

export default dartConnector(CreateDartNightDialog);
