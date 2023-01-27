import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { TournamentTeam } from "definitions/Definitions";
import "./animation.css";
import { Button, DialogActions } from "@mui/material";
import bgImage from "../../assets/img/draw2.webp";

interface Props {
  drawRunning: "open" | "running" | "finished";
  setDrawRunning: (b: "open" | "running" | "finished") => void;
  teams: TournamentTeam[];
  drawPlayersFirst?: boolean;
}

const AnimatedDraw: React.FC<Props> = ({
  drawRunning,
  setDrawRunning,
  teams,
  drawPlayersFirst = true,
}) => {
  //   const [open, setOpen] = React.useState(drawRunning);
  const [seq, setSeq] = React.useState(0);

  const handleSkip: () => void = () => {
    setDrawRunning("finished");
  };

  const animationSequence = React.useMemo(() => {
    const sequence: string[] = [];
    if (drawPlayersFirst) {
      addPlayersToSequence(teams, sequence);
      teams.forEach((t) => sequence.push(t.team?.name || ""));
    } else {
      teams.forEach((t) => sequence.push(t.team?.name || ""));
      addPlayersToSequence(teams, sequence);
    }
    return sequence;
  }, [teams, drawPlayersFirst]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSeq((seq) => seq + 1);
      console.log(seq);
    }, 4000);

    if (seq === animationSequence.length) {
      setDrawRunning("finished");
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [seq, setDrawRunning]);

  return (
    <Dialog
      open={drawRunning === "running"}
      fullScreen
      transitionDuration={500}
    >
      <Box
        width="100%"
        height="100%"
        alignSelf="center"
        display="flex"
        justifyContent="center"
        style={{
          backgroundImage: "url(" + bgImage + ")",
          backgroundSize: "cover",
        }}
      >
        <Paper
          elevation={24}
          style={{
            height: "fit-content",
            padding: 40,
            width: "50%",
            alignSelf: "center",
            verticalAlign: "center",
          }}
        >
          {teams.map((t, tIndex) => {
            {
              return (
                <>
                  <Grid
                    key={`${tIndex}-container`}
                    container
                    rowGap={2}
                    //   marginTop="30pt"
                    fontSize={28}
                    fontWeight="bold"
                  >
                    <>
                      {t.players.map((p, pIndex) => (
                        <>
                          <Grid
                            key={`${tIndex}-${pIndex}`}
                            item
                            textAlign={"center"}
                            xs={t.players.length === 1 ? 8 : 5}
                            sm={5}
                            md={t.players.length === 1 ? 5 : 3}
                            className={
                              seq < animationSequence.indexOf(p.name)
                                ? "animated-new"
                                : seq === animationSequence.indexOf(p.name)
                                ? "animated-draw"
                                : ""
                            }
                          >
                            {p.name}
                          </Grid>
                          {pIndex < t.players.length - 1 && (
                            <Grid
                              key={`${tIndex}-${pIndex}-and`}
                              item
                              fontSize={16}
                              textAlign={"center"}
                              xs={2}
                              sm={2}
                              md={1}
                            >
                              {"&"}
                            </Grid>
                          )}
                        </>
                      ))}
                      <Grid
                        key={`${tIndex}-with`}
                        item
                        textAlign={"center"}
                        xs={t.players.length === 1 ? 4 : 6}
                        sm={6}
                        md={2}
                        fontStyle="italic"
                        color="grey"
                        fontSize={16}
                      >
                        {"with"}
                      </Grid>
                      <Grid
                        key={`${tIndex}-team`}
                        item
                        textAlign={"center"}
                        fontStyle="italic"
                        color="grey"
                        xs={t.players.length === 1 ? 10 : 6}
                        sm={6}
                        md={t.players.length === 1 ? 5 : 3}
                        className={
                          seq < animationSequence.indexOf(t.team?.name || "")
                            ? "animated-new"
                            : seq ===
                              animationSequence.indexOf(t.team?.name || "")
                            ? "animated-draw"
                            : ""
                        }
                      >
                        {t.team?.name}
                      </Grid>
                    </>
                  </Grid>
                  {tIndex < teams.length - 1 && (
                    <hr key={`${tIndex}-hr`} style={{ margin: "30pt 10pt" }} />
                  )}
                </>
              );
            }
          })}
        </Paper>
      </Box>
      <DialogActions>
        <Button onClick={handleSkip}>Skip</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnimatedDraw;
function addPlayersToSequence(teams: TournamentTeam[], sequence: string[]) {
  let pIndex = 0;
  for (
    let i = 0;
    i <
    teams.flatMap((t) => t.players.length).reduce((a, b) => a + b, 0) /
      teams.length;
    i++
  ) {
    teams.forEach((t) => sequence.push(t.players[pIndex].name));
    pIndex++;
  }
}
