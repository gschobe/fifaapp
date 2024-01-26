import { Grid, GridSize } from "@material-ui/core";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { SoundKind, usePlaySound } from "dart/utils/SoundUtil";
import React from "react";

interface Props {
  setScoredPoints: (points: number, double: boolean, triple: boolean) => void;
  backClicked: () => void;
  numbers: number[];
  keySize?: GridSize;
}
const FullKeyboard: React.FC<Props> = ({
  setScoredPoints,
  backClicked,
  numbers,
  keySize = 3,
}) => {
  const buttons = React.useMemo(() => {
    return [...numbers];
  }, [numbers]);

  const [triple, setTriple] = React.useState(false);
  const [double, setDouble] = React.useState(false);

  return (
    <Grid container spacing={1} style={{ height: "98%" }}>
      {buttons.map((b) => (
        <Grid
          key={b}
          item
          xs={keySize}
          style={{ height: "14%", display: "flex" }}
        >
          <Key
            label={b}
            onClick={() => {
              setScoredPoints(Number(b), double, triple);
              setDouble(false);
              setTriple(false);
            }}
            active={!(triple && b === 25)}
            soundKind={b === 25 ? "BULL" : "CLICK"}
          />
        </Grid>
      ))}
      <Grid
        key={"double"}
        item
        xs={keySize}
        style={{ height: "14%", display: "flex" }}
      >
        <Toggle
          label="Double"
          onClick={() => {
            setDouble((double) => !double);
            setTriple(false);
          }}
          active={double}
          soundKind={"DOUBLE"}
        />
      </Grid>
      <Grid
        key={"triple"}
        item
        xs={keySize}
        style={{ height: "14%", display: "flex" }}
      >
        <Toggle
          label="Triple"
          onClick={() => {
            setTriple((triple) => !triple);
            setDouble(false);
          }}
          active={triple}
          soundKind={"TRIPLE"}
        />
      </Grid>
      <Grid
        key={"miss"}
        item
        xs={keySize}
        style={{ height: "14%", display: "flex" }}
      >
        <Key
          label="Miss"
          onClick={() => {
            setScoredPoints(0, false, false);
            setTriple(false);
            setDouble(false);
          }}
          color="error"
          soundKind={"MISS"}
        />
      </Grid>
      <Grid
        key={"back-grid"}
        item
        xs={keySize}
        style={{ height: "14%", display: "flex" }}
      >
        <Key
          label="Zurück"
          onClick={() => {
            backClicked();
            setTriple(false);
            setDouble(false);
          }}
          color="inherit"
        />
      </Grid>
    </Grid>
  );
};

export default FullKeyboard;

export const Key: React.FC<{
  label: string | number;
  onClick: () => void;
  soundKind?: SoundKind;
  color?: "inherit" | "info" | "primary" | "secondary" | "success" | "error";
  backgroundColor?: string;
  active?: boolean;
}> = ({
  label,
  onClick,
  color,
  soundKind = "CLICK",
  // backgroundColor = "inherit",
  active = true,
}) => {
  const [play] = usePlaySound(soundKind);
  return (
    <Button
      variant="contained"
      disabled={!active}
      key={label}
      color={color ?? "info"}
      onClick={() => {
        play();
        onClick();
      }}
      sx={{
        flex: 1,
        fontWeight: "bold",
        fontSize: "2vw",
        // backgroundColor: "skyblue",
        // color: "black",
        boxShadow: 3,
      }}
      // TouchRippleProps={{ color: "pink" }}
    >
      {label}
    </Button>
  );
};

export const Toggle: React.FC<{
  label: string | number;
  onClick: () => void;
  active?: boolean;
  soundKind?: SoundKind;
}> = ({ label, onClick, active = true, soundKind = "CLICK" }) => {
  const [play] = usePlaySound(soundKind);
  return (
    <ToggleButtonGroup
      value={active ? label : undefined}
      fullWidth
      unselectable="on"
      exclusive
      color="secondary"
      onChange={() => {
        play();
        onClick();
      }}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <ToggleButton
        value={label}
        sx={{
          fontWeight: "bold",
          fontSize: "2.0vw",
          boxShadow: 3,
        }}
      >
        {label}
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
