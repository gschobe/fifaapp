/* eslint-disable no-debugger */
import React from "react";
import FullKeyboard from "./components/keyboard/FullKeyboard";
import PlayerScoreX01 from "./components/PlayerScoreX01";
import {
  DartTeam,
  X01Game,
  X01GameSettings,
  X01Player,
  X01Try,
} from "./Definitions";
import {
  calculateAverage,
  getCurrentRoundDarts,
  getNewX01Player,
} from "./utils/DartUtil";
import _ from "lodash";
import { defaultDartBoardNumbers } from "./assets/numbers";
import { DartStoreProps, dartConnector } from "store/DartStore";

interface Props extends DartStoreProps {
  gameSettings: X01GameSettings;
  players?: DartTeam[];
  dartGame?: X01Game;
}

const X01DartOverview: React.FC<Props> = ({
  gameSettings,
  players,
  dartGame,
  setGame,
}) => {
  const game = React.useMemo<X01Game>(
    () =>
      dartGame
        ? { ...dartGame, players: [...dartGame.players] }
        : {
            type: "X01",
            settings: gameSettings,
            round: 1,
            players:
              players?.map((p, idx) =>
                getNewX01Player(gameSettings.kind, p, idx === 0)
              ) ?? [],
            finishedPlayers: [],
            state: "RUNNING",
          },
    [dartGame, players, gameSettings]
  );
  const [actTry, setActTry] = React.useState(1);

  const setScoredPoints = (p: number, double: boolean, triple: boolean) => {
    const points = triple ? p * 3 : double ? p * 2 : p;
    const activePl = game.players.find((p) => p.active);
    if (activePl) {
      const activePlayer = {
        ...activePl,
        score: { ...activePl.score, tries: [...activePl.score.tries] },
      };
      const score = activePlayer.score.remaining ?? game.settings.kind;
      const newGame = { ...game };
      const activePlayerIndex = newGame.players.findIndex(
        (p) => p.team.name === activePlayer.team.name
      );
      newGame.players[activePlayerIndex] = activePlayer;
      const multiplier = triple ? 3 : double ? 2 : 1;
      activePlayer.score.tries.push({
        number: p,
        multiplier: multiplier,
        points: p * multiplier,
        score: triple ? "TRIPLE" : double ? "DOUBLE" : "SINGLE",
      });
      if (
        points > score ||
        (game.settings.finishKind !== "SINGLE OUT" && score - points === 1) ||
        (score === points &&
          game.settings.finishKind === "DOUBLE OUT" &&
          !double) ||
        (score === points &&
          game.settings.finishKind === "MASTERS OUT" &&
          !double &&
          !triple)
      ) {
        // overthrown
        // TODO reduce points to start of round
        for (let i = actTry; i <= 3; i++) {
          activePlayer?.score?.tries.push({
            number: 0,
            multiplier: multiplier,
            points: 0,
            score: triple ? "TRIPLE" : double ? "DOUBLE" : "SINGLE",
          });
        }

        const currentRoundDarts: X01Try[] = getCurrentRoundDarts(
          game.round,
          activePlayer
        );
        const currentRoundPoints =
          _.sumBy(currentRoundDarts, (crd) => crd.points) - points;

        // set back the remaining points to start of round points
        activePlayer.score.remaining =
          activePlayer.score.remaining + currentRoundPoints;
        activateNext(activePlayer, game, newGame);
      } else {
        if (
          score !== game.settings.kind ||
          game.settings.startKind === "SINGLE IN" ||
          (game.settings.startKind === "DOUBLE IN" && double)
        ) {
          // regular throw
          activePlayer.score.remaining =
            (activePlayer?.score?.remaining ?? game.settings.kind) - points;
        }

        activePlayer.score.average = calculateAverage(
          activePlayer,
          game.settings.kind - activePlayer.score.remaining
        );
      }

      if (activePlayer.score.remaining === 0) {
        const finished = newGame.players.filter((p) => p.finishRank !== 0);
        activePlayer.finishRank = finished.length + 1;
        newGame.finishedPlayers = [...newGame.finishedPlayers, activePlayer];
        activateNext(activePlayer, game, newGame);
        const notFinished = newGame.players.filter((p) => p.finishRank === 0);
        if (notFinished.length === 1) {
          const last = {
            ...notFinished[0],
            finishRank: activePlayer.finishRank + 1,
          };
          const lastIndex = newGame.players.findIndex(
            (p) => p.team.name === last.team.name
          );
          newGame.finishedPlayers.push(last);
          newGame.players[lastIndex] = last;
        }
        setActTry(1);
      } else {
        if (actTry === 3) {
          activateNext(activePlayer, game, newGame);
        }
        setActTry((value) => (value === 3 ? 1 : value + 1));
      }

      setGame(newGame);
    }
  };

  const undo = () => {
    const active = game.players.find((p) => p.active);
    if (
      active &&
      (active.score.remaining !== game.settings.kind ||
        game.players.indexOf(active) > 0)
    ) {
      const activePlayer = {
        ...active,
        finishRank: 0,
        score: { ...active.score, tries: [...active.score.tries] },
      };
      const newGame = { ...game };
      const activePlayerIndex = newGame.players.findIndex(
        (p) => p.team.name === activePlayer.team.name
      );
      newGame.players[activePlayerIndex] = activePlayer;
      const tries = activePlayer.score.tries;
      const currentRoundDarts = getCurrentRoundDarts(game.round, activePlayer);

      if (currentRoundDarts.length > 0) {
        const lastThrowPoints = tries.pop();
        if (lastThrowPoints) {
          activePlayer.score.remaining =
            activePlayer.score.remaining + lastThrowPoints?.points ?? 0;

          activePlayer.score.average = calculateAverage(
            activePlayer,
            game.settings.kind - activePlayer.score.remaining
          );
          setActTry((value) => (value === 1 ? 3 : value - 1));
        }
      }

      // const currentRoundDarts = getCurrentRoundDarts(game.round, activePlayer);
      if (currentRoundDarts.length === 0) {
        const activeIndex = game.players.indexOf(activePlayer);
        if (activeIndex > 0 || game.round > 1) {
          activePlayer.active = false;
          const previousIndex =
            activeIndex > 0 ? activeIndex - 1 : game.players.length - 1;
          const previousPlayer = newGame.players[previousIndex];
          const newActive = {
            ...previousPlayer,
            score: {
              ...previousPlayer.score,
              tries: [...previousPlayer.score.tries],
            },
          };
          newGame.players[previousIndex] = newActive;
          const lastThrowPoints = newActive.score.tries.pop();
          newActive.active = true;
          newActive.score.remaining =
            newActive.score.remaining + (lastThrowPoints?.points ?? 0);
          newActive.score.average = calculateAverage(
            newActive,
            game.settings.kind - activePlayer.score.remaining
          );
          newActive.finishRank = 0;
          setActTry(3);
          if (previousIndex === game.players.length - 1 && game.round > 1) {
            newGame.round = game.round - 1;
          }
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
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          minWidth: "350px",
          flex: 1.5,
          display: "flex",
          flexDirection: "column",
          rowGap: 10,
          overflow: "auto",
        }}
      >
        {game.players.map((p) => (
          <PlayerScoreX01 key={p.team.name} player={p} round={game.round} />
        ))}
      </div>
      <div
        style={{
          flex: 1,
          minWidth: "220px",
          marginBottom: "14pt",
          marginRight: "5pt",
        }}
      >
        <FullKeyboard
          setScoredPoints={setScoredPoints}
          backClicked={undo}
          numbers={defaultDartBoardNumbers}
        />
      </div>
    </div>
  );
};

export default dartConnector(X01DartOverview);

function activateNext(
  activePlayer: X01Player,
  game: X01Game,
  newGame: X01Game
) {
  activePlayer.active = false;
  if (newGame.players.length > newGame.finishedPlayers.length) {
    let currentIndex = game.players.indexOf(activePlayer);

    let next = -1;
    while (next === -1) {
      const nextIndex =
        game.players.length - 1 === currentIndex ? 0 : currentIndex + 1;
      if (newGame.players[nextIndex].finishRank === 0) {
        next = nextIndex;
      } else {
        currentIndex = nextIndex;
      }
    }
    newGame.players[next] = { ...game.players[next], active: true };
    if (next === 0) {
      newGame.round = game.round + 1;
    }
  }
}
