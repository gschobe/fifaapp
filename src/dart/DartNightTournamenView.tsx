import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DartStoreProps, dartConnector } from "store/DartStore";
import DartTournamentPanel from "./components/DartTournamentPanel";
import determineTeamMates from "./utils/DartDrawUtil";
import { DartTeam } from "./Definitions";

interface Props extends DartStoreProps {
  dnId: number;
  dtId: number;
}
const DartNightTournamenView: React.FC<Props> = ({
  dnId,
  dtId,
  dartNights,
  setTournamentGames,
}) => {
  const navigate = useNavigate();
  const dartNight = dartNights[dnId];
  const tournament = dartNight?.tournaments.find((dt) => dt.id === dtId);

  if (!dartNight || !tournament) {
    return <h3>Not found!</h3>;
  }

  const doDraw = () => {
    const tournamentTeams: DartTeam[] = [];
    const { games, possibleDraws } = determineTeamMates(
      dartNight,
      tournamentTeams,
      tournament
    );
    console.log(possibleDraws);
    setTournamentGames({
      dartNight: dnId,
      tournamentId: dtId,
      games: games,
    });
  };

  return (
    <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <div style={{ width: "100%" }}>
        <Stack
          direction={"row"}
          marginTop={"10px"}
          spacing={2}
          alignItems={"center"}
        >
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "4vh",
              display: "flex",
              lineHeight: "100%",
            }}
          >{`Dart Abend ${
            Object.values(dartNights).indexOf(dartNight) + 1
          } - Tournament ${
            Object.values(dartNight.tournaments).indexOf(tournament) + 1
          }
          `}</div>
          <div style={{ flex: 1 }} />
          {/* <Button
            disabled={dartNight?.tournaments.some(
              (t) => t.state !== "FINISHED"
            )}
            variant="contained"
            onClick={() => navigate(-1)}
          >
            {"Zurück"}
          </Button> */}
        </Stack>
        <DartTournamentPanel
          dartNight={dartNight.id}
          id={Object.values(dartNight.tournaments).indexOf(tournament) + 1}
          dt={tournament}
          draw={doDraw}
        />
      </div>
    </div>
  );
};

export default dartConnector(DartNightTournamenView);
