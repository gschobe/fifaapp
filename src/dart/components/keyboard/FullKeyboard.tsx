import { Grid, GridSize } from "@material-ui/core";
import { Button } from "@mui/material";
import { SoundKind, usePlaySound } from "dart/utils/SoundUtil";
import React from "react";

interface Props {
  setScoredPoints: (points: number, double: boolean, triple: boolean) => void;
  backClicked: () => void;
  numbers: number[];
  keySize?: GridSize;
  allMissed?: () => void;
  actTry?: number;
}
const FullKeyboard: React.FC<Props> = ({
  setScoredPoints,
  backClicked,
  numbers,
  keySize = 3,
  allMissed,
  actTry,
}) => {
  const buttons = React.useMemo(() => {
    return [...numbers];
  }, [numbers]);

  const [triple, setTriple] = React.useState(false);
  const [double, setDouble] = React.useState(false);

  return (
    <Grid container spacing={1} style={{ height: "100%" }}>
      {buttons.map((b) => (
        <Grid key={b} item xs={keySize} style={{ display: "flex" }}>
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
      <Grid key={"double"} item xs={keySize} style={{ display: "flex" }}>
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
      <Grid key={"triple"} item xs={keySize} style={{ display: "flex" }}>
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
      <Grid key={"miss"} item xs={keySize} style={{ display: "flex" }}>
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
        key={"allmissed-grid"}
        item
        xs={keySize}
        style={{ display: "flex" }}
      >
        <Key
          label="3 MISS"
          onClick={() => {
            allMissed && allMissed();
            setTriple(false);
            setDouble(false);
          }}
          active={actTry === 1}
          color="error"
          soundKind="MISS"
        />
      </Grid>
      <Grid key={"back-grid"} item xs={keySize} style={{ display: "flex" }}>
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
        fontSize: "3.5vh",
        lineHeight: "3.5vh",
        boxShadow: 3,
      }}
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
  color?: "inherit" | "info" | "primary" | "secondary" | "success" | "error";
}> = ({ label, onClick, active = true, soundKind = "CLICK", color }) => {
  const [play] = usePlaySound(soundKind);
  return (
    <Button
      variant={active ? "contained" : "outlined"}
      // disabled={!active}
      key={label}
      color={color ?? "secondary"}
      onClick={() => {
        !active && play();
        onClick();
      }}
      sx={{
        flex: 1,
        fontWeight: "bold",
        fontSize: "3vh",
        lineHeight: "3vh",
        boxShadow: 3,
      }}
    >
      {label}
    </Button>
  );
};
