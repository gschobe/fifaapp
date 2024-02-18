/* eslint-disable no-debugger */
import React from "react";
import FullKeyboard from "./components/keyboard/FullKeyboard";
import {
  CricketGame,
  CricketPlayer,
  CricketSettings,
  CricketTry,
  DartTeam,
} from "./Definitions";
import {
  getCurrentRoundDarts,
  getNewCricketPlayer,
  getPlayerPointsCricket,
} from "./utils/DartUtil";
import _ from "lodash";
import PlayerScoreCricket from "./components/PlayerScoreCricket";
import { DartStoreProps, dartConnector } from "store/DartStore";

interface Props extends DartStoreProps {
  gameSettings: CricketSettings;
  players?: DartTeam[];
  dartGame?: CricketGame;
}

const CricketDartOverview: React.FC<Props> = ({
  gameSettings,
  players,
  dartGame,
  setGame,
}) => {
  const game = React.useMemo<CricketGame>(() => {
    return dartGame
      ? { ...dartGame, players: [...dartGame.players] }
      : {
          id: new Date().getTime(),
          leg: 1,
          set: 1,
          type: "Cricket",
          settings: gameSettings,
          round: 1,
          players:
            players?.map((p, idx) =>
              getNewCricketPlayer(p, gameSettings, idx === 0)
            ) ?? [],
          finishedPlayers: [],
          state: "RUNNING",
        };
  }, [dartGame, players]);
  const [actTry, setActTry] = React.useState(
    ((game?.players?.find((p) => p.active)?.score?.tries?.length ?? 0) % 3) + 1
  );

  const allMissed = () => {
    const active = game.players.find((pl) => pl.active);
    const activeIndex = game.players.findIndex(
      (p) => p.team.name === active?.team.name
    );
    if (active && activeIndex !== -1) {
      const activePlayer = {
        ...active,
        finishRank: 0,
        score: { ...active.score, tries: [...active.score.tries] },
      };
      const newGame = { ...game };
      newGame.players[activeIndex] = activePlayer;

      const tries: CricketTry[] = Array(3)
        .fill(0)
        .map(() => ({
          number: 0,
          hits: 0,
          multiplier: 1,
          points: 0,
          cutThroat: [],
          score: "SINGLE",
        }));

      activePlayer.score.tries.push(...tries);

      activateNext(activePlayer, game, newGame);

      setGame(newGame);
    }
  };

  const setScoredPoints = (p: number, double: boolean, triple: boolean) => {
    const hits = triple ? 3 : double ? 2 : 1;
    const active = game.players.find((pl) => pl.active);
    const activeIndex = game.players.findIndex(
      (p) => p.team.name === active?.team.name
    );
    if (active && activeIndex !== -1) {
      const activePlayer = {
        ...active,
        finishRank: 0,
        score: { ...active.score, tries: [...active.score.tries] },
      };
      const newGame = { ...game };
      newGame.players[activeIndex] = activePlayer;

      const numberScore = _.sumBy(
        activePlayer.score.tries.filter((t) => t.number === p),
        (t) => t.hits
      );
      const acttry: CricketTry = {
        number: p,
        hits: 0,
        multiplier: hits,
        points: 0,
        cutThroat: [],
        score: "SINGLE",
      };

      if (numberScore !== undefined) {
        const needed = 3 - numberScore;
        const additionalHits = hits - needed;

        acttry.hits = needed < hits ? needed : hits;
        if (additionalHits > 0) {
          const notClosedPlayers = newGame.players.filter(
            (pl) =>
              pl.team.name !== activePlayer.team.name &&
              _.sumBy(
                pl.score.tries.filter((t) => t.number === p),
                (t) => t.hits
              ) !== 3
          );
          if (notClosedPlayers && notClosedPlayers.length > 0) {
            acttry.points = additionalHits * p;
            if (game.settings.mode === "DEFAULT") {
              activePlayer.score.points =
                activePlayer.score.points + additionalHits * p;
            } else if (game.settings.mode === "CUT THROAT") {
              console.log(notClosedPlayers);
              notClosedPlayers.forEach((pl) => {
                const player = {
                  ...pl,
                  score: {
                    ...pl.score,
                    points: pl.score.points + additionalHits * p,
                  },
                };
                const index = newGame.players.findIndex(
                  (p) => p.team.name === player.team.name
                );
                newGame.players[index] = player;
                acttry.cutThroat.push(pl.team.name);
              });
            }
          }
        }
      }
      activePlayer.score.tries.push(acttry);

      const score = new Map(game.settings.numbers.map((num) => [num, 0]));
      activePlayer.score.tries
        .filter((t) => t.number !== 0)
        .forEach((t) => {
          score.set(t.number, (score.get(t.number) ?? 0) + t.hits);
        });

      const activePlayerPoints = getPlayerPointsCricket(
        newGame.settings.mode,
        activePlayer,
        newGame.players
      );
      if (
        Array.from(score.values()).some((h) => h !== 3) ||
        (newGame.settings.mode === "DEFAULT" &&
          newGame.players
            .map((pl) => _.sumBy(pl.score.tries, (t) => t.points))
            .some(
              (p) =>
                p > activePlayerPoints ||
                (newGame.settings.mode === "CUT THROAT" &&
                  p < activePlayerPoints)
            )) ||
        (newGame.settings.mode === "CUT THROAT" &&
          newGame.players
            .map((player) =>
              _.sumBy(
                newGame.players.flatMap((pl) =>
                  pl.score.tries.filter((t) =>
                    t.cutThroat.includes(player.team.name)
                  )
                ),
                (t) => t.points
              )
            )
            .some((p) => p < activePlayerPoints))
      ) {
        setActTry((value) => (value === 3 ? 1 : value + 1));
      } else {
        const finished = newGame.players.filter((p) => p.finishRank !== 0);
        activePlayer.finishRank = finished.length + 1;
        activateNext(activePlayer, game, newGame);
        const notFinished = newGame.players.filter((p) => p.finishRank === 0);
        if (notFinished.length === 1) {
          const last = notFinished[0];
          last.finishRank = activePlayer.finishRank + 1;
        }
        setActTry(1);
      }
      if (actTry === 3) {
        activateNext(activePlayer, game, newGame);
      }
      setGame(newGame);
    }
  };

  const undo = () => {
    const active = game.players.find((p) => p.active);
    const activeIndex = game.players.findIndex(
      (p) => p.team.name === active?.team.name
    );
    if (active && activeIndex !== -1) {
      const activePlayer = {
        ...active,
        finishRank: 0,
        score: { ...active.score, tries: [...active.score.tries] },
      };
      const newGame = { ...game };
      newGame.players[activeIndex] = activePlayer;

      const currentRoundDarts = getCurrentRoundDarts(game.round, activePlayer);
      if (currentRoundDarts.length > 0) {
        activePlayer.score.tries.pop();
        activePlayer.finishRank = 0;
        setActTry((value) => (value === 1 ? 3 : value - 1));
      } else {
        const activeIndex = game.players.indexOf(activePlayer);
        if (activeIndex > 0 || game.round > 1) {
          activePlayer.active = false;
          const previousIndex =
            activeIndex > 0 ? activeIndex - 1 : game.players.length - 1;
          const previousPlayer = newGame.players[previousIndex];
          const newActive = {
            ...previousPlayer,
            finishRank: 0,
            score: {
              ...previousPlayer.score,
              tries: [...previousPlayer.score.tries],
              active: true,
            },
          };
          newGame.players[previousIndex] = newActive;
          newActive.finishRank = 0;
          newActive.score.tries.pop();
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
      }}
    >
      <div
        style={{
          minWidth: "350px",
          flex: 2,
          display: "flex",
          flexDirection: "column",
          rowGap: 5,
          overflow: "auto",
        }}
      >
        {game.finishedPlayers.concat(game.players).map((p) => (
          <PlayerScoreCricket key={p.team.name} player={p} game={game} />
        ))}
      </div>
      <div
        style={{
          flex: 1,
          minWidth: "220px",
        }}
      >
        <FullKeyboard
          setScoredPoints={setScoredPoints}
          backClicked={undo}
          numbers={gameSettings.numbers}
          keySize={6}
          allMissed={allMissed}
          actTry={actTry}
        />
      </div>
    </div>
  );
};

export default dartConnector(CricketDartOverview);

function activateNext(
  activePlayer: CricketPlayer,
  game: CricketGame,
  newGame: CricketGame
) {
  activePlayer.active = false;
  const activeIndex = game.players.indexOf(activePlayer);
  const nextIndex =
    game.players.length - 1 === activeIndex ? 0 : activeIndex + 1;
  game.players[nextIndex] = { ...game.players[nextIndex], active: true };
  if (nextIndex === 0) {
    newGame.round = game.round + 1;
  }
}
