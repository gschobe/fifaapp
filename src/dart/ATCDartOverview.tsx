/* eslint-disable no-debugger */
import React from "react";
import {
  ATCGame,
  ATCHitScore,
  ATCPlayer,
  ATCSettings,
  DartTeam,
} from "./Definitions";
import { getNewATCPlayer } from "./utils/DartUtil";
import ATCKeyboard from "./components/keyboard/ATCKeyboard";
import PlayerScoreATC from "./components/PlayerScoreATC";
import { DartStoreProps, dartConnector } from "store/DartStore";

interface Props extends DartStoreProps {
  gameSettings: ATCSettings;
  players?: DartTeam[];
  dartGame: ATCGame;
}

const ATCDartOverview: React.FC<Props> = ({
  gameSettings,
  players,
  dartGame,
  setGame,
}) => {
  const game = React.useMemo<ATCGame>(() => {
    return dartGame
      ? { ...dartGame, players: [...dartGame.players] }
      : {
          type: "ATC",
          settings: gameSettings,
          round: 1,
          players:
            players?.map((p, idx) =>
              getNewATCPlayer(p, gameSettings, idx === 0)
            ) ?? [],
          finishedPlayers: [],
          state: "RUNNING",
        };
  }, [dartGame, players]);
  const [actTry, setActTry] = React.useState(1);

  const setScored = (hit: ATCHitScore) => {
    const active = game.players.find((pl) => pl.active);
    const activeIndex = game.players.findIndex(
      (p) => p.team.name === active?.team.name
    );
    if (active && activeIndex !== -1) {
      const activePlayer = {
        ...active,
        score: {
          ...active.score,
          hits: new Map(active.score.hits.entries()),
          tries: [...active.score.tries],
        },
      };
      const newGame = { ...game };
      newGame.players[activeIndex] = activePlayer;

      activePlayer.dartsThrown = activePlayer.dartsThrown + 1;
      if (hit !== "MISS") {
        const hits = hit === "TRIPLE" ? 3 : hit === "DOUBLE" ? 2 : 1;
        const open = Array.from(activePlayer.score.hits.entries()).filter(
          (e) => e[1] === undefined
        );
        if (open && open.length > hits) {
          for (let i = 0; i < hits; i++) {
            activePlayer.score.hits.set(open[i][0], hit);
          }
          activePlayer.score.tries.push({
            score: hit,
            currentNumber: open[0][0],
          });
        } else if (open && open.length === 1) {
          activePlayer.finishRank = newGame.finishedPlayers.length + 1;
          activateNext(activePlayer, game, newGame);
          newGame.finishedPlayers = [...newGame.finishedPlayers, activePlayer];
          newGame.players = [
            ...newGame.players.filter((p) => p !== activePlayer),
          ];
          if (newGame.players.length === 1) {
            const last = newGame.players[0];
            last.finishRank = newGame.finishedPlayers.length + 1;
            newGame.finishedPlayers.push(last);
            newGame.players = [];
          }
          setActTry(1);
        }
      } else {
        const open = Array.from(activePlayer.score.hits.entries()).filter(
          (e) => e[1] === undefined
        );
        activePlayer.score.tries.push({
          score: hit,
          currentNumber: open[0][0],
        });
      }
      setActTry((value) => (value === 3 ? 1 : value + 1));
      if (actTry === 3) {
        activateNext(activePlayer, game, newGame);
      }
      setGame(newGame);
    }
  };

  const undo = () => {
    const activePlayer = game.players.find((p) => p.active);
    if (activePlayer) {
      const activeIndex = game.players.indexOf(activePlayer);
      const newGame = { ...game };
      newGame.players[activeIndex] = activePlayer;

      if (
        activeIndex === 0 &&
        game.round === 1 &&
        activePlayer.dartsThrown === 0
      ) {
        return;
      }
      if (activePlayer?.dartsThrown % 3 > 0) {
        activePlayer.dartsThrown = activePlayer.dartsThrown - 1;
        activePlayer.finishRank = 0;
        const lastTry = activePlayer.score.tries.pop();
        if (lastTry?.score !== "MISS") {
          revertLastHit(activePlayer);
        }
        setActTry((value) => (value === 1 ? 3 : value - 1));
      } else {
        activePlayer.active = false;
        const previousIndex =
          activeIndex > 0 ? activeIndex - 1 : game.players.length - 1;
        const previous = newGame.players[previousIndex];
        const newActive = {
          ...previous,
          score: {
            ...previous.score,
            hits: new Map(previous.score.hits.entries()),
            tries: [...previous.score.tries],
          },
          active: true,
        };
        newGame.players[previousIndex] = newActive;
        newActive.finishRank = 0;
        newActive.dartsThrown = newActive.dartsThrown - 1;
        const lastTry = newActive.score.tries.pop();
        if (lastTry && lastTry?.score !== "MISS") {
          revertLastHit(newActive);
        }
        setActTry(3);
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
          width: "80%",
          display: "flex",
          flexDirection: "column",
          rowGap: 10,
          overflow: "auto",
        }}
      >
        {game.finishedPlayers.concat(game.players).map((p, idx) => (
          <PlayerScoreATC key={idx} player={p} />
        ))}
      </div>
      <div
        style={{
          flex: 1,
          marginBottom: "14pt",
          marginRight: "5pt",
        }}
      >
        <ATCKeyboard
          setScored={setScored}
          backClicked={undo}
          kind={
            game.settings.mode === "QUICK" && game.settings.hitMode === "SINGLE"
              ? "EXTENDED"
              : "SIMPLE"
          }
        />
      </div>
    </div>
  );
};

export default dartConnector(ATCDartOverview);

function revertLastHit(activePlayer: ATCPlayer) {
  const lastHitIndex = Array.from(
    activePlayer.score.hits.values()
  ).findLastIndex((v) => v !== undefined);

  const keys = Array.from(activePlayer.score.hits.keys());
  const values = Array.from(activePlayer.score.hits.values());
  // revert score
  switch (values[lastHitIndex]) {
    case "SINGLE":
      activePlayer.score.hits.set(keys[lastHitIndex], undefined);
      break;
    case "DOUBLE":
      activePlayer.score.hits.set(keys[lastHitIndex], undefined);
      activePlayer.score.hits.set(keys[lastHitIndex - 1], undefined);
      break;
    case "TRIPLE":
      activePlayer.score.hits.set(keys[lastHitIndex], undefined);
      activePlayer.score.hits.set(keys[lastHitIndex - 1], undefined);
      activePlayer.score.hits.set(keys[lastHitIndex - 2], undefined);
      break;
    default:
      break;
  }
}

function activateNext(
  activePlayer: ATCPlayer,
  game: ATCGame,
  newGame: ATCGame
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
