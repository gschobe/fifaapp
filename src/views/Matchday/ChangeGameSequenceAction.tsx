import IconButton from "@material-ui/core/IconButton";
import React from "react";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import MoveUpRoundedIcon from "@mui/icons-material/MoveUpRounded";
import MoveDownRoundedIcon from "@mui/icons-material/MoveDownRounded";
import { Game } from "definitions/Definitions";

const ChangeGameSequenceAction: React.FC<
  { game: Game } & MatchDayStoreProps
> = ({ game, moveGameDown, moveGameUp }) => {
  const moveDown = React.useCallback(() => {
    moveGameDown(game);
  }, [moveGameDown, game]);
  const moveUp = React.useCallback(() => {
    moveGameUp(game);
  }, [moveGameUp, game]);
  return (
    <>
      {game.state === "OPEN" && (
        <IconButton onClick={moveUp} style={{ padding: 5 }}>
          <MoveUpRoundedIcon fontSize="small" />
        </IconButton>
      )}
      {["OPEN", "UPCOMING"].includes(game.state) && (
        <IconButton onClick={moveDown} style={{ padding: 5 }}>
          <MoveDownRoundedIcon fontSize="small" />
        </IconButton>
      )}
    </>
  );
};

export default matchDayConnector(ChangeGameSequenceAction);
