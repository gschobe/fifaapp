import React from "react";
import { Grid } from "@material-ui/core";

interface Props {
  setScoredPoints: (points: number, double: boolean, triple: boolean) => void;
  backClicked: () => void;
}
const FullKeyboard: React.FC<Props> = ({ setScoredPoints, backClicked }) => {
  const buttons = React.useMemo(() => {
    const scores = [];
    for (let score = 1; score < 21; score++) {
      scores.push(score);
    }
    scores.push(25);
    scores.push("Double");
    scores.push("Triple");
    return scores;
  }, []);

  const [triple, setTriple] = React.useState(false);
  const [double, setDouble] = React.useState(false);

  return (
    <Grid container spacing={2} style={{ height: "90%" }}>
      {buttons.map((b) => (
        <Grid key={b} item xs={3}>
          <div
            key={b}
            onClick={() => {
              if (b === "Triple") {
                setTriple((triple) => !triple);
                setDouble(false);
              } else if (b === "Double") {
                setDouble((double) => !double);
                setTriple(false);
              } else {
                setScoredPoints(Number(b), double, triple);
                setDouble(false);
                setTriple(false);
              }
            }}
            style={{
              cursor: "pointer",
              pointerEvents: b === 25 && triple ? "none" : "auto",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "24px",
              display: "table-cell",
              verticalAlign: "middle",
              border: "solid black 1pt",
              boxShadow: "3px 2px 2px grey",
              borderRadius: "5pt",
              width: "12vw",
              height: "10vh",
              opacity: b === 25 && triple ? 0.5 : 1,
              backgroundColor:
                (b === "Triple" && triple) || (double && b === "Double")
                  ? "blue"
                  : "inherit",
              color:
                (b === "Triple" && triple) || (double && b === "Double")
                  ? "white"
                  : "inherit",
            }}
          >
            {b}
          </div>
        </Grid>
      ))}
      <Grid key={"back"} item xs={3}>
        <div
          key={"back"}
          onClick={() => {
            setScoredPoints(0, false, false);
            setTriple(false);
            setDouble(false);
          }}
          style={{
            cursor: "pointer",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "24px",
            display: "table-cell",
            verticalAlign: "middle",
            border: "solid black 1pt",
            boxShadow: "3px 2px 2px grey",
            borderRadius: "5pt",
            width: "12vw",
            height: "10vh",
          }}
        >
          {"MISS"}
        </div>
      </Grid>
      <Grid key={"back-grid"} item xs={3}>
        <div
          key={"back"}
          onClick={() => {
            backClicked();
            setTriple(false);
            setDouble(false);
          }}
          style={{
            cursor: "pointer",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "24px",
            display: "table-cell",
            verticalAlign: "middle",
            border: "solid black 1pt",
            boxShadow: "3px 2px 2px grey",
            borderRadius: "5pt",
            width: "12vw",
            height: "10vh",
            backgroundColor: "lightgray",
          }}
        >
          {"Zurück"}
        </div>
      </Grid>
    </Grid>
  );
};

export default FullKeyboard;
