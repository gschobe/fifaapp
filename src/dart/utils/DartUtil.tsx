import {
  defaultCricketNumbers,
  defaultDartBoardNumbers,
} from "dart/assets/numbers";
import _ from "lodash";
import { DartGame } from "store/DartStore";
import {
  ATCPlayer,
  ATCSettings,
  CricketMode,
  CricketPlayer,
  CricketSettings,
  DartTeam,
  EliminationPlayer,
  EliminationSettings,
  GameSettings,
  ShooterPlayer,
  ShooterSettings,
  X01Kind,
  X01Player,
} from "../Definitions";
import { possibleOuts } from "../assets/data";
import React from "react";

export const defaultGameSettings: GameSettings = {
  choosenGame: "X01",
  teamMode: "SINGLE",
  teamSize: 1,
  x01: {
    kind: 301,
    startKind: "SINGLE IN",
    finishKind: "SINGLE OUT",
    legs: 1,
    sets: 1,
  },
  cricket: {
    numbers: defaultCricketNumbers,
    mode: "DEFAULT",
    numbersMode: "DEFAULT",
    legs: 1,
    sets: 1,
  },
  atc: {
    mode: "DEFAULT",
    hitMode: "SINGLE",
    numberMode: "SEQUENCIAL",
    numbers: defaultDartBoardNumbers.slice(0, 20),
    legs: 1,
    sets: 1,
  },
  shooter: {
    rounds: 10,
    numberMode: "RANDOM",
    countSettings: { single: 1, double: 2, triple: 3, singleBull: 2, bull: 4 },
    numbers: [],
    legs: 1,
    sets: 1,
  },
  elimination: {
    kind: 301,
    finishKind: "SINGLE OUT",
    legs: 1,
    sets: 1,
  },
};
export function calculateAverage(
  player: X01Player | EliminationPlayer,
  thrownPoints: number
): number {
  const dartsThrown = getNumDartsThrown(player);
  if (dartsThrown === 0) {
    return 0;
  }
  const dartAvg = thrownPoints / dartsThrown;

  return Number((dartAvg * 3).toFixed(2));
}

export function getNumDartsThrown(
  player: X01Player | EliminationPlayer
): number {
  return player.score.tries.length;
}

export function isFinish(points: number): boolean {
  return Object.keys(possibleOuts).includes(points.toString());
}

export function getPossibleOuts(remainder: number): string[] | undefined {
  return (
    Object.entries(possibleOuts).find(
      (po) => po[0] === remainder.toString()
    )?.[1] ?? undefined
  );
}

export function getNewX01Player(
  kind: X01Kind,
  team: DartTeam,
  active = false
): X01Player {
  return {
    team: team,
    active: active,
    finishRank: 0,
    legsWon: 0,
    setsWon: 0,
    score: {
      remaining: kind,
      average: 0,
      tries: [],
    },
  };
}

export function getNewEliminationPlayer(
  team: DartTeam,
  gameSettings: EliminationSettings,
  active = false
): EliminationPlayer {
  return {
    team: team,
    active: active,
    finishRank: 0,
    legsWon: 0,
    setsWon: 0,
    score: {
      points: 0,
      average: 0,
      tries: [],
    },
  };
}
export function getNewCricketPlayer(
  team: DartTeam,
  settings: CricketSettings,
  active = false
): CricketPlayer {
  return {
    team: team,
    active: active,
    finishRank: 0,
    legsWon: 0,
    setsWon: 0,
    score: {
      points: 0,
      tries: [],
    },
  };
}
export function getNewATCPlayer(
  team: DartTeam,
  settings: ATCSettings,
  active = false
): ATCPlayer {
  return {
    team: team,
    active: active,
    finishRank: 0,
    dartsThrown: 0,
    legsWon: 0,
    setsWon: 0,
    score: {
      hits: new Map(settings.numbers.map((num) => [num, undefined])),
      tries: [],
    },
  };
}
export function getNewShooterPlayer(
  team: DartTeam,
  settings: ShooterSettings,
  active = false
): ShooterPlayer {
  return {
    team: team,
    active: active,
    finishRank: 0,
    dartsThrown: 0,
    legsWon: 0,
    setsWon: 0,
    score: {
      points: 0,
      tries: [],
      openNumbers: [...settings.numbers],
    },
  };
}

export function getCurrentRoundDarts(
  round: number,
  player: X01Player | CricketPlayer | ShooterPlayer | EliminationPlayer,
  bust?: boolean
) {
  const currentRound = Math.trunc(player.score.tries.length / 3);
  const lastRoundDart = player.score.tries.length % 3 === 0;
  const startIndex =
    (player.active && !lastRoundDart && !bust
      ? currentRound
      : currentRound - 1) * 3;
  const currentRoundDarts = player.score.tries.slice(
    startIndex,
    startIndex + 3
  );
  return [...currentRoundDarts];
}

export function getPlayerPointsCricket(
  mode: CricketMode,
  activePlayer: CricketPlayer,
  players: CricketPlayer[]
) {
  return mode === "DEFAULT"
    ? _.sumBy(
        activePlayer.score.tries.filter((t) => t.cutThroat.length === 0),
        (t) => t.points
      )
    : _.sumBy(
        players.flatMap((pl) =>
          pl.score.tries.filter((t) =>
            t.cutThroat.includes(activePlayer.team.name)
          )
        ),
        (t) => t.points
      );
}

export function getChoosenGameSettings(game: DartGame) {
  switch (game.type) {
    case "X01": {
      return (
        <>
          <div>{`Kind: ${game.settings.kind}`}</div>
          <div>{`Start: ${game.settings.startKind}`}</div>
          <div>{`Finish: ${game.settings.finishKind}`}</div>
        </>
      );
    }
    case "Cricket":
      return (
        <>
          <div>{`Mode: ${game.settings.mode}`}</div>
          <div>{`Numbers: ${game.settings.numbersMode}`}</div>
        </>
      );
    case "ATC":
      return (
        <>
          <div>{`Mode: ${game.settings.mode}`}</div>
          <div>{`Numbers: ${game.settings.numberMode}`}</div>
          <div>{`Hit: ${game.settings.hitMode}`}</div>
        </>
      );
    case "Shooter":
      return (
        <>
          <div>{`Mode: ${game.settings.numberMode}`}</div>
        </>
      );
    case "Elimination":
      return (
        <>
          <div>{`Kind: ${game.settings.kind}`}</div>
          <div>{`Finish: ${game.settings.finishKind}`}</div>
        </>
      );
  }
}

// export function isGameFinished(game: X01Game) {
//   const setsToWin = game.settings.sets;

//   const winner = game.players.find(
//     (p) =>
//       p.setScore && p.setScore.filter((sc) => sc.setWon).length >= setsToWin
//   );

//   return !!winner;
// }
