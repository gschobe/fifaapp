/* eslint-disable no-debugger */
import React from "react";
import { DartStoreProps, dartConnector } from "store/DartStore";
import { DartTeam, X01Game, X01GameSettings } from "./Definitions";
import { defaultDartBoardNumbers } from "./assets/numbers";
import PlayerScoreX01 from "./components/PlayerScoreX01";
import FullKeyboard from "./components/keyboard/FullKeyboard";
import { addNewX01Set } from "./utils/DartDrawUtil";
import { getNewX01Player } from "./utils/DartUtil";

interface Props extends DartStoreProps {
  gameSettings: X01GameSettings;
  players?: DartTeam[];
  dartGame?: X01Game;
}

const X01DartOverview: React.FC<Props> = ({
  gameSettings,
  players,
  dartGame,
  addX01Try,
  undoX01Try,
  allMissed,
}) => {
  // const [playBust] = usePlaySound("BUST");
  const game = React.useMemo<X01Game>(() => {
    if (dartGame) {
      return { ...dartGame, players: [...dartGame.players] };
    } else {
      const gamePlayers =
        players?.map((p, idx) =>
          getNewX01Player(gameSettings.kind, p, idx === 0)
        ) ?? [];
      return {
        id: new Date().getTime(),
        type: "X01",
        settings: gameSettings,
        leg: 1,
        set: 1,
        round: 1,
        players: gamePlayers,
        finishedPlayers: [],
        state: "RUNNING",
        sets: addNewX01Set([], gamePlayers),
      };
    }
  }, [dartGame, players, gameSettings]);

  const setScoredPoints = (p: number, double: boolean, triple: boolean) => {
    const activePl = game.players.find((p) => p.active);
    if (activePl) {
      const activePlayer = {
        ...activePl,
        score: { ...activePl.score, tries: [...activePl.score.tries] },
      };
      const newGame = { ...game };
      const activePlayerIndex = newGame.players.findIndex(
        (p) => p.team.name === activePlayer.team.name
      );
      newGame.players[activePlayerIndex] = activePlayer;

      const multiplier = triple ? 3 : double ? 2 : 1;

      addX01Try({
        game: game,
        try: {
          number: p,
          multiplier: multiplier,
          points: p * multiplier,
          score: triple ? "TRIPLE" : double ? "DOUBLE" : "SINGLE",
        },
      });

      // player finshed current leg
      if (newGame.finishedPlayers.length === newGame.players.length) {
        handleSetsAndLegs(newGame);
      }
    }

    function handleSetsAndLegs(game: X01Game) {
      if (
        game.players.length === 2 &&
        (game.settings.legs > 1 || game.settings.sets > 1)
      ) {
        const players = [...game.players];
        let finished = false;
        players.forEach((p) => {
          if (p.legsWon + 1 === game.settings.legs) {
            if (p.score.finishRank === 1) {
              p.setsWon += 1;
            }
            if (p.setsWon === game.settings.sets) {
              p.finishRank = p.score.finishRank ?? -1;
              finished = true;
            }
            p.legsWon = 0;
            game.leg = 1;
            game.set += 1;
          } else {
            if (p.score.finishRank === 1) {
              p.legsWon += 1;
            }
            game.leg += 1;
          }
        });

        players.forEach((p, idx) => {
          if (finished) {
            p.finishRank = p.score.finishRank ?? -1;
          } else {
            p.score = {
              remaining: game.settings.kind,
              average: 0,
              tries: [],
            };
          }
          game.players[idx] = p;
        });
        game.finishedPlayers = [];
        game.round = 1;
      } else {
        game.players.forEach(
          (p, idx) =>
            (game.players[idx] = { ...p, finishRank: p.score.finishRank ?? -1 })
        );
        console.error("SET mode for more than 2 players not supported");
      }
    }
  };

  const handleAllMissed = () => {
    allMissed(game);
  };

  const undo = () => {
    const active = game.players.find((p) => p.active);

    active && undoX01Try(game);
  };

  return (
    <div
      style={{
        flex: 1,
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
          <PlayerScoreX01 key={p.team.name} player={p} game={game} />
        ))}
      </div>
      <div
        style={{
          flex: 1,
          minWidth: "220px",
          marginRight: "5pt",
        }}
      >
        <FullKeyboard
          setScoredPoints={setScoredPoints}
          backClicked={undo}
          numbers={defaultDartBoardNumbers}
          // actTry={actTry}
          allMissed={handleAllMissed}
        />
      </div>
    </div>
  );
};

export default dartConnector(X01DartOverview);
