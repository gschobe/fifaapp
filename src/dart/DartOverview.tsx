/* eslint-disable no-debugger */
import React from "react";
import FullKeyboard from "./components/keyboard/FullKeyboard";
import PlayerScoreX01 from "./components/PlayerScoreX01";
import { X01FinishKind, X01Game, X01Kind, X01StartKind } from "./Definitions";
import { calculateAverage, getNewX01Player } from "./DartUtil";
import { isNumber } from "lodash";

interface Props {
  kind: X01Kind;
  start: X01StartKind;
  finish: X01FinishKind;
}
const DartOverview: React.FC<Props> = ({ start, finish, kind }) => {
  const [game, setGame] = React.useState<X01Game>({
    startScoreKind: kind,
    startKind: start,
    finishKind: finish,
    round: 1,
    players: [
      getNewX01Player(kind, "Gernot", true),
      getNewX01Player(kind, "Dele"),
      getNewX01Player(kind, "Martin"),
      getNewX01Player(kind, "Fertz"),
    ],
    finishedPlayers: [],
  });
  const [actTry, setActTry] = React.useState(1);

  const setScoredPoints = (p: number, double: boolean, triple: boolean) => {
    const points = triple ? p * 3 : double ? p * 2 : p;
    const activePlayer = game.players.find((p) => p.active);
    if (activePlayer) {
      const score = activePlayer.score.remaining;
      const newGame = { ...game };
      if (points > score) {
        // overthrown
        const threeDartScore =
          activePlayer.score.threeDartScore[game.round - 1] ?? [];
        threeDartScore[actTry - 1] = points;
        activePlayer.score.threeDartScore[game.round - 1] = threeDartScore;
      } else {
        if (
          score !== game.startScoreKind ||
          game.startKind === "SINGLE IN" ||
          (game.startKind === "DOUBLE IN" && double)
        ) {
          // regular throw
          activePlayer.score.remaining = activePlayer.score.remaining - points;
        }

        const threeDartScore = activePlayer.score.threeDartScore[
          game.round - 1
        ] ?? ["-", "-", "-"];
        threeDartScore[actTry - 1] = points;
        activePlayer.score.threeDartScore[game.round - 1] = threeDartScore;
        activePlayer.score.average = calculateAverage(
          activePlayer,
          game.startScoreKind
        );
      }
      if (actTry === 3) {
        activePlayer.active = false;
        const activeIndex = game.players.indexOf(activePlayer);
        const nextIndex =
          game.players.length - 1 === activeIndex ? 0 : activeIndex + 1;
        game.players[nextIndex] = { ...game.players[nextIndex], active: true };
        if (nextIndex === 0) {
          newGame.round = game.round + 1;
        }
      }
      if (activePlayer.score.remaining === 0) {
        activePlayer.finishRank = newGame.finishedPlayers.length + 1;
        newGame.finishedPlayers.push(activePlayer);
        newGame.players = [
          ...newGame.players.filter((p) => p !== activePlayer),
        ];
        setActTry(1);
      } else {
        setActTry((value) => (value === 3 ? 1 : value + 1));
      }
      setGame(newGame);
      // TODO -> UNDO finished / FINISHED after 2 or less darts
    }
  };

  const undo = () => {
    const activePlayer = game.players.find((p) => p.active);
    if (
      activePlayer &&
      (activePlayer.score.remaining !== game.startScoreKind ||
        game.players.indexOf(activePlayer) > 0)
    ) {
      //   const score = activePlayer.score.remaining;
      const newGame = { ...game };
      const threeDartScore = activePlayer.score.threeDartScore[game.round - 1];
      const lastIndex = threeDartScore.findLastIndex((s) => isNumber(s));

      if (lastIndex !== -1) {
        const lastThrowPoints = Number(threeDartScore[lastIndex]);
        activePlayer.score.remaining =
          activePlayer.score.remaining + lastThrowPoints;

        threeDartScore[lastIndex] = "-";
        activePlayer.score.threeDartScore[game.round - 1] = threeDartScore;
        activePlayer.score.average = calculateAverage(
          activePlayer,
          game.startScoreKind
        );
        setActTry((value) => (value === 1 ? 3 : value - 1));
      }

      if (lastIndex <= 0) {
        activePlayer.active = false;
        const activeIndex = game.players.indexOf(activePlayer);
        const previousIndex =
          activeIndex > 0 ? activeIndex - 1 : game.players.length - 1;
        newGame.players[previousIndex] = {
          ...game.players[previousIndex],
          active: true,
        };
        if (previousIndex === game.players.length - 1 && game.round > 1) {
          newGame.round = game.round - 1;
        }
      }
      setGame(newGame);
    }
  };
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        columnGap: "10pt",
      }}
    >
      <div
        style={{
          minWidth: "350px",
          flex: 1.5,
          display: "flex",
          flexDirection: "column",
          rowGap: 5,
          overflow: "auto",
        }}
      >
        {game.finishedPlayers.concat(game.players).map((p) => {
          return <PlayerScoreX01 key={p.name} player={p} />;
        })}
      </div>
      <div style={{ flex: 1, minWidth: "240px", margin: "2pt" }}>
        <FullKeyboard setScoredPoints={setScoredPoints} backClicked={undo} />
      </div>
    </div>
  );
};

export default DartOverview;
