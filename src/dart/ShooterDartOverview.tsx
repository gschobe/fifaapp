/* eslint-disable no-debugger */
import React from "react";
import {
  ATCHitScore,
  DartTeam,
  ShooterCountSettings,
  ShooterGame,
  ShooterPlayer,
  ShooterSettings,
} from "./Definitions";
import PlayerScoreShooter from "./components/PlayerScoreShooter";
import { getNewShooterPlayer } from "./utils/DartUtil";
import ATCKeyboard from "./components/keyboard/ATCKeyboard";
import _ from "lodash";
import { DartStoreProps, dartConnector } from "store/DartStore";

interface Props extends DartStoreProps {
  gameSettings: ShooterSettings;
  players?: DartTeam[];
  dartGame: ShooterGame;
}

const ShooterDartOverview: React.FC<Props> = ({
  gameSettings,
  players,
  dartGame,
  setGame,
}) => {
  const game = React.useMemo<ShooterGame>(
    () =>
      dartGame
        ? { ...dartGame, players: [...dartGame.players] }
        : {
            id: new Date().getTime(),
            leg: 1,
            set: 1,
            type: "Shooter",
            settings: gameSettings,
            round: 1,
            players:
              players?.map((p, idx) =>
                getNewShooterPlayer(p, gameSettings, idx === 0)
              ) ?? [],
            finishedPlayers: [],
            state: "RUNNING",
          },
    [dartGame, players, gameSettings]
  );
  const [actTry, setActTry] = React.useState(
    ((game?.players?.find((p) => p.active)?.score?.tries?.length ?? 0) % 3) + 1
  );

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
          tries: [...active.score.tries],
          openNumbers: [...active.score.openNumbers],
        },
      };
      const newGame = { ...game };
      newGame.players[activeIndex] = activePlayer;

      activePlayer.dartsThrown += 1;

      if (hit !== "MISS") {
        const currentNumber = activePlayer.score.openNumbers[0];
        activePlayer.score.tries.push({
          points: getShooterPointsForThrow(
            currentNumber,
            hit,
            newGame.settings.countSettings
          ),
          multiplier: 0,
          score: hit,
          number: activePlayer.score.openNumbers[0],
        });
      } else {
        activePlayer.score.tries.push({
          points: 0,
          multiplier: 0,
          score: hit,
          number: activePlayer.score.openNumbers[0],
        });
      }

      setActTry((value) => (value === 3 ? 1 : value + 1));

      if (actTry === 3) {
        activePlayer.score.openNumbers.splice(0, 1);
        activateNext(activePlayer, game, newGame);
      }
      setGame(newGame);
    }
  };

  const undo = () => {
    const active = game.players.find((pl) => pl.active);
    const activeIndex = game.players.findIndex(
      (p) => p.team.name === active?.team.name
    );

    if (active && activeIndex !== -1) {
      const activePlayer = {
        ...active,
        score: {
          ...active.score,
          tries: [...active.score.tries],
          openNumbers: [...active.score.openNumbers],
        },
      };
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
        activePlayer.dartsThrown -= 1;
        // const lastTry =
        activePlayer.score.tries.pop();

        setActTry((value) => (value === 1 ? 3 : value - 1));
      } else {
        setActTry(3);
        activePlayer.active = false;
        const previousIndex =
          activeIndex > 0 ? activeIndex - 1 : game.players.length - 1;
        const previous = newGame.players[previousIndex];
        const newActive = {
          ...previous,
          score: {
            ...previous.score,
            tries: [...previous.score.tries],
          },
          active: true,
        };
        newGame.players[previousIndex] = newActive;

        newActive.dartsThrown -= 1;
        const lastTry = newActive.score.tries.pop();

        if (lastTry) {
          newActive.score.openNumbers = [
            lastTry.number,
            ...newActive.score.openNumbers,
          ];
        }
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
          rowGap: 5,
          overflow: "auto",
        }}
      >
        {game.players.map((p, idx) => (
          <PlayerScoreShooter key={idx} player={p} game={game} />
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
          kind={"EXTENDED"}
          disableTriple={
            game.players.find((p) => p.active)?.score.openNumbers[0] === 25
          }
        />
      </div>
    </div>
  );
};

export default dartConnector(ShooterDartOverview);

function activateNext(
  activePlayer: ShooterPlayer,
  game: ShooterGame,
  newGame: ShooterGame
) {
  activePlayer.active = false;
  const activeIndex = newGame.players.indexOf(activePlayer);
  const allFinished = newGame.players.every(
    (p) => p.score.openNumbers.length === 0
  );
  if (allFinished) {
    const ranked = newGame.players
      .map((p) => ({
        points: _.sumBy(p.score.tries, "points"),
        player: p,
      }))
      .sort((rp1, rp2) => rp2.points - rp1.points)
      .map((rp, idx) => ({ ...rp.player, finishRank: idx + 1 }));
    newGame.players = [...ranked];
  } else {
    const nextIndex =
      game.players.length - 1 === activeIndex ? 0 : activeIndex + 1;
    game.players[nextIndex] = { ...game.players[nextIndex], active: true };
    if (nextIndex === 0) {
      newGame.round = game.round + 1;
    }
  }
}
function getShooterPointsForThrow(
  currentNumber: number,
  hit: ATCHitScore,
  countSettings: ShooterCountSettings
): number {
  switch (hit) {
    case "SINGLE":
      return currentNumber === 25
        ? countSettings.singleBull
        : countSettings.single;
    case "DOUBLE":
      return currentNumber === 25 ? countSettings.bull : countSettings.double;
    case "TRIPLE":
      return currentNumber !== 25 ? countSettings.triple : 0;
    case "MISS":
      return 0;
  }
}
