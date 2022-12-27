import React from "react";
import { Game } from "definitions/Definitions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import { DialogContent } from "@mui/material";
import { GameScore } from "./GameScore";

export interface Props {
  game: Game;
}
const CorrectGameDialog: React.FC<Props & MatchDayStoreProps> = ({
  game,
  //   setScore,
  correctGame,
}) => {
  const [open, setOpen] = React.useState(false);
  const [homeScore, setHomeScore] = React.useState(game.goalsHome);
  const [awayScore, setAwayScore] = React.useState(game.goalsAway);
  const onClick = () => {
    setOpen((open) => !open);
  };
  const handleConfirm = () => {
    // setScore({
    //   matchdayId: game.matchdayId,
    //   tournamentId: game.tournamentId,
    //   gameSeq: game.sequence,
    //   homeScore: homeScore,
    //   awayScore: awayScore,
    // });
    correctGame({
      matchdayId: game.matchdayId,
      tournamentId: game.tournamentId,
      gameSeq: game.sequence,
      newHomeScore: homeScore || 0,
      newAwayScore: awayScore || 0,
    });
    // calculateStats(game.matchdayId);
    onClick();
  };

  const handleHomeScoreChange = (e: any) => {
    setHomeScore(Number(e.target.value));
  };
  const handleAwayScoreChange = (e: any) => {
    setAwayScore(Number(e.target.value));
  };

  return (
    <>
      <Dialog open={open} onClose={onClick}>
        <DialogTitle>Correct Game Result</DialogTitle>
        <DialogContent>
          <GameScore
            liveGame={game}
            homeScore={homeScore || 0}
            awayScore={awayScore || 0}
            handleHomeScoreChange={handleHomeScoreChange}
            handleAwayScoreChange={handleAwayScoreChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClick}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <IconButton onClick={onClick}>
        <CreateRoundedIcon fontSize="small" />
      </IconButton>
    </>
  );
};

export default matchDayConnector(CorrectGameDialog);
