/* eslint-disable no-debugger */
import _ from "lodash";
import React from "react";
import { DartStoreProps, dartConnector } from "store/DartStore";
import {
  DartTeam,
  EliminationGame,
  EliminationPlayer,
  EliminationSettings,
  X01Try,
} from "./Definitions";
import { defaultDartBoardNumbers } from "./assets/numbers";
import PlayerScoreElimination from "./components/PlayerScoreElimination";
import FullKeyboard from "./components/keyboard/FullKeyboard";
import {
  calculateAverage,
  getCurrentRoundDarts,
  getNewEliminationPlayer,
} from "./utils/DartUtil";

interface Props extends DartStoreProps {
  gameSettings: EliminationSettings;
  players?: DartTeam[];
  dartGame?: EliminationGame;
}

const EliminationDartOverview: React.FC<Props> = ({
  gameSettings,
  players,
  dartGame,
  setGame,
}) => {
  const game = React.useMemo<EliminationGame>(
    () =>
      dartGame
        ? { ...dartGame, players: [...dartGame.players] }
        : {
            id: new Date().getTime(),
            set: 1,
            leg: 1,
            type: "Elimination",
            settings: gameSettings,
            round: 1,
            players:
              players?.map((p, idx) =>
                getNewEliminationPlayer(p, gameSettings, idx === 0)
              ) ?? [],
            finishedPlayers: [],
            state: "RUNNING",
          },
    [dartGame, players, gameSettings]
  );
  const [actTry, setActTry] = React.useState(
    ((game?.players?.find((p) => p.active)?.score?.tries?.length ?? 0) % 3) + 1
  );

  const setScoredPoints = (p: number, double: boolean, triple: boolean) => {
    const points = triple ? p * 3 : double ? p * 2 : p;
    const activePl = game.players.find((p) => p.active);
    if (activePl) {
      const activePlayer = {
        ...activePl,
        score: { ...activePl.score, tries: [...activePl.score.tries] },
      };
      const remaining = game.settings.kind - activePlayer.score.points;
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
        points > remaining ||
        (game.settings.finishKind !== "SINGLE OUT" &&
          remaining - points === 1) ||
        (remaining === points &&
          game.settings.finishKind === "DOUBLE OUT" &&
          !double) ||
        (remaining === points &&
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
        activePlayer.score.points =
          activePlayer.score.points - currentRoundPoints;
        activateNext(activePlayer, game, newGame);
      } else {
        // if (
        //   score !== game.settings.kind ||
        //   game.settings.startKind === "SINGLE IN" ||
        //   (game.settings.startKind === "DOUBLE IN" && double)
        // ) {
        // regular throw
        activePlayer.score.points = activePlayer.score.points + points;
        // }

        activePlayer.score.average = calculateAverage(
          activePlayer,
          activePlayer.score.points
        );

        newGame.players
          .filter(
            (p) =>
              p.team.name !== activePlayer.team.name &&
              p.score.points === activePlayer.score.points
          )
          .forEach((ep) => {
            const player = {
              ...ep,
              score: {
                ...ep.score,
                points: 0,
              },
            };
            const index = newGame.players.findIndex(
              (p) => p.team.name === player.team.name
            );
            newGame.players[index] = player;
          });
      }

      if (game.settings.kind - activePlayer.score.points === 0) {
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
      (active.score.tries.length > 0 || game.players.indexOf(active) > 0)
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
          activePlayer.score.points =
            activePlayer.score.points - lastThrowPoints?.points ?? 0;

          activePlayer.score.average = calculateAverage(
            activePlayer,
            activePlayer.score.points
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
          newActive.score.points =
            newActive.score.points - (lastThrowPoints?.points ?? 0);
          newActive.score.average = calculateAverage(
            newActive,
            activePlayer.score.points
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
          rowGap: 5,
          overflow: "auto",
        }}
      >
        {game.players.map((p) => (
          <PlayerScoreElimination
            key={p.team.name}
            player={p}
            round={game.round}
            kind={game.settings.kind}
          />
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

export default dartConnector(EliminationDartOverview);

function activateNext(
  activePlayer: EliminationPlayer,
  game: EliminationGame,
  newGame: EliminationGame
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
