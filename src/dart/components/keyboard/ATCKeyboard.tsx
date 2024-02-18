import { Grid, GridSize } from "@material-ui/core";
import { ATCHitScore } from "dart/Definitions";
import React from "react";
import { Key } from "./FullKeyboard";

interface Props {
  setScored: (hit: ATCHitScore) => void;
  backClicked: () => void;
  kind: "SIMPLE" | "EXTENDED";
  disableTriple?: boolean;
  keySize?: GridSize;
}
const ATCKeyboard: React.FC<Props> = ({
  setScored,
  backClicked,
  kind,
  disableTriple = false,
  keySize = 12,
}) => {
  return (
    <Grid container spacing={1} style={{ height: "98%" }}>
      {kind === "EXTENDED" ? (
        <>
          <Grid
            key={"single"}
            item
            xs={keySize}
            style={{ height: "18%", display: "flex" }}
          >
            <Key
              label="Single"
              onClick={() => {
                setScored("SINGLE");
              }}
            />
          </Grid>
          <Grid
            key={"double"}
            item
            xs={keySize}
            style={{ height: "18%", display: "flex" }}
          >
            <Key
              label="Double"
              onClick={() => {
                setScored("DOUBLE");
              }}
              soundKind={"DOUBLE"}
            />
          </Grid>
          <Grid
            key={"triple"}
            item
            xs={keySize}
            style={{ height: "18%", display: "flex" }}
          >
            <Key
              label="Triple"
              active={!disableTriple}
              soundKind={"TRIPLE"}
              onClick={() => {
                setScored("TRIPLE");
              }}
            />
          </Grid>
        </>
      ) : (
        <Grid
          key={"hit"}
          item
          xs={keySize}
          style={{ height: "30%", display: "flex" }}
        >
          <Key
            label="Hit"
            onClick={() => {
              setScored("SINGLE");
            }}
          />
        </Grid>
      )}
      <Grid
        key={"miss"}
        item
        xs={keySize}
        style={{
          height: kind === "EXTENDED" ? "18%" : "30%",
          display: "flex",
        }}
      >
        <Key
          label="Miss"
          onClick={() => {
            setScored("MISS");
          }}
          color="error"
          soundKind={"MISS"}
        />
      </Grid>
      <Grid
        key={"back-grid"}
        item
        xs={keySize}
        style={{ height: "18%", display: "flex" }}
      >
        <Key
          label="Zurück"
          onClick={() => {
            backClicked();
          }}
          color="inherit"
        />
      </Grid>
    </Grid>
  );
};

export default ATCKeyboard;

// export const Key: React.FC<{
//   label: string | number;
//   onClick: () => void;
//   color?: string;
//   backgroundColor?: string;
// }> = ({ label, onClick, color = "inherit", backgroundColor = "inherit" }) => {
//   return (
//     <div
//       key={label}
//       onClick={() => onClick()}
//       style={{
//         cursor: "pointer",
//         textAlign: "center",
//         fontWeight: "bold",
//         fontSize: "2.4vw",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         border: "solid black 1pt",
//         boxShadow: "3px 2px 2px grey",
//         borderRadius: "5pt",
//         width: "12vw",
//         height: "auto",
//         lineHeight: "100%",
//         flex: 1,
//         backgroundColor: backgroundColor,
//         color: color,
//       }}
//     >
//       {label}
//     </div>
//   );
// };
