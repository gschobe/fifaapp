import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";
import { DartStoreProps, dartConnector } from "store/DartStore";
import { StoreProps, storeConnector } from "store/StoreReducer";

interface Props extends StoreProps, DartStoreProps {
  open: boolean;
  close: () => void;
  game: "FIFA" | "DART";
}
const AddPlayerModal: React.FC<Props> = ({
  open,
  close,
  game,
  player,
  addPlayer,
  dPlayers,
  addDartPlayer,
}) => {
  const [name, setName] = React.useState<string>("");
  const [playerError, setPlayerError] = React.useState(true);

  const players = React.useMemo(() => {
    return game === "FIFA" ? Object.values(player) : Object.values(dPlayers);
  }, [player]);

  const onChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (
    event
  ) => {
    const entered = event.target.value;
    setName(entered);
    setPlayerError(
      !entered || players.map((p: any) => p?.name).includes(entered)
    );
  };

  const handlePlayerAdd = React.useCallback(() => {
    if (game === "FIFA") {
      addPlayer(name);
    } else {
      addDartPlayer(name);
    }
    setName("");
    close();
  }, [close, name]);
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add Player</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          error={playerError}
          margin="normal"
          id="player"
          label="Player to add:"
          type="text"
          value={name}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close()}>Cancel</Button>
        <Button onClick={handlePlayerAdd} disabled={playerError}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default storeConnector(dartConnector(AddPlayerModal));
