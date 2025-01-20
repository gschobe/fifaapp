/* eslint-disable no-debugger */
import { Dictionary, PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ATCGame,
  CricketGame,
  DPlayer,
  DartNight,
  DartNightSettings,
  DartPlayer,
  DartTournament,
  EliminationGame,
  ShooterGame,
  X01Game,
  X01Leg,
  X01Set,
  X01Try,
} from "dart/Definitions";
import { getLatestLeg } from "dart/utils/DartUtil";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "./Store";
import _ from "lodash";

export type DartGame =
  | X01Game
  | CricketGame
  | ATCGame
  | ShooterGame
  | EliminationGame;
export interface DartState {
  players: Dictionary<DPlayer>;
  dartNight: Dictionary<DartNight>;
  fastGame: DartGame | undefined;
  fastGameHistory: DartGame[];
}

const initialState: DartState = {
  players: {},
  dartNight: {},
  fastGame: undefined,
  fastGameHistory: [],
};

const dartSlice = createSlice({
  name: "dart",
  initialState,
  reducers: {
    addDartPlayer: (state, action: PayloadAction<string>) => {
      state.players[action.payload] = {
        name: action.payload,
      };
    },
    setFastGame: (state, action: PayloadAction<DartGame>) => {
      const current = state.fastGame;
      current && state.fastGameHistory.push({ ...current });
      if (state.fastGameHistory.length >= 4) {
        state.fastGameHistory.sort((g1, g2) => g1.id - g2.id).shift();
      }
      state.fastGame = action.payload;
    },
    removeFastGame: (state) => {
      delete state.fastGame;
    },
    removeGame: (state, action: PayloadAction<DartGame>) => {
      const game = action.payload;
      if (game.dartNightId) {
        const dartNight = state.dartNight[game.dartNightId];
        if (dartNight) {
          if (game.dartTournamentId) {
            console.error("not implemented");
          } else {
            const gameIndex = dartNight.games.findIndex(
              (g) => g.id === game.id
            );
            if (gameIndex >= 0) {
              dartNight.games = [...dartNight.games].toSpliced(gameIndex, 1);
            }
          }
        }
      } else if (game.id === state.fastGame?.id) {
        delete state.fastGame;
      }
    },
    addDartNight: (state, action: PayloadAction<DartNight>) => {
      state.dartNight[action.payload.id] = action.payload;
    },
    removeDartNight: (state, action: PayloadAction<number | undefined>) => {
      action.payload && delete state.dartNight[action.payload];
    },
    addTournament: (
      state,
      action: PayloadAction<{ dartNight: number; tournament: DartTournament }>
    ) => {
      const dartNight = state.dartNight[action.payload.dartNight];
      if (dartNight) {
        dartNight.tournaments.push(action.payload.tournament);
      }
    },
    removeTournament: (
      state,
      action: PayloadAction<{ dartNight: number; tournament: DartTournament }>
    ) => {
      const dartNight = state.dartNight[action.payload.dartNight];
      if (dartNight) {
        dartNight.tournaments = dartNight.tournaments.filter(
          (dt) => dt.id !== action.payload.tournament.id
        );
      }
    },
    setTournamentGames: (
      state,
      action: PayloadAction<{
        dartNight: number;
        tournamentId: number;
        games: DartGame[];
      }>
    ) => {
      const dartNight = state.dartNight[action.payload.dartNight];
      if (dartNight) {
        const tournament = dartNight.tournaments.find(
          (t) => t.id === action.payload.tournamentId
        );
        if (tournament) {
          tournament.games = action.payload.games;
        }
      }
    },
    startGame: (
      state,
      action: PayloadAction<{ dartNight: number; tournamentId: number }>
    ) => {
      const dartNight = state.dartNight[action.payload.dartNight];
      if (dartNight) {
        const tournament = dartNight.tournaments.find(
          (t) => t.id === action.payload.tournamentId
        );
        if (tournament) {
          const upcoming = tournament.games.find((g) => g.state === "UPCOMING");
          if (upcoming) {
            upcoming.state = "RUNNING";
          }
        }
      }
    },
    setGame: (state, action: PayloadAction<DartGame>) => {
      const game = action.payload;
      if (game.players.every((p) => p.finishRank > 0)) {
        game.state = "FINISHED";
      }
      const dartNight = state.dartNight[game.dartNightId ?? 0];
      if (dartNight) {
        const tournament = dartNight.tournaments.find(
          (t) => t.id === game.dartTournamentId
        );
        if (tournament) {
          const activeGame = tournament.games.find(
            (g) => g.state === "RUNNING"
          );
          if (activeGame) {
            tournament.games[tournament.games.indexOf(activeGame)] = game;
          }
        } else {
          const index = dartNight.games.findIndex(
            (g) => g.sequence === game.sequence
          );
          if (index != -1) {
            dartNight.games[index] = game;
          }
        }
      } else {
        state.fastGame = game;
      }
    },
    addGame: (state, action: PayloadAction<DartGame>) => {
      const game = action.payload;
      const dartNight = state.dartNight[game.dartNightId ?? 0];
      if (dartNight) {
        dartNight.games.push(game);
      }
    },
    changeSettings: (
      state,
      action: PayloadAction<{
        dartNightId: number;
        settings: DartNightSettings;
      }>
    ) => {
      const dartNight = state.dartNight[action.payload.dartNightId];
      if (dartNight) {
        dartNight.settings = action.payload.settings;
      }
    },
    addX01Try: (
      state,
      action: PayloadAction<{ game: X01Game; try: X01Try }>
    ) => {
      const game = action.payload.game;
      if (!game.dartNightId && state.fastGame) {
        const activePl = state.fastGame.players.find((p) => p.active);
        const latest = getLatestLeg(state.fastGame);

        latest.leg?.tries?.push({
          player: activePl?.team.name ?? "",
          try: action.payload.try,
          tryNum: (latest.leg.tries.length ?? 0) + 1,
        });

        const tries = latest.leg?.tries.filter(
          (t) => t.player === activePl?.team.name
        );

        const successfulTries = tries?.filter(
          (t) => !["MISS", "BUST"].includes(t.try.score)
        );

        // handle wrong start dart thrown
        if (successfulTries?.filter.length === 1) {
          if (
            game.settings.startKind === "DOUBLE IN" &&
            action.payload.try.multiplier !== 2
          ) {
            const t = successfulTries[0];
            t.try.score = "MISS";
            t.try.points = 0;
          }
        }

        const pointsThrownTotal = _.sum(
          successfulTries?.map((t) => t.try.points)
        );

        const remaining = game.settings.kind - pointsThrownTotal;

        const wrongFinish =
          remaining === 0 &&
          ((game.settings.finishKind === "DOUBLE OUT" &&
            action.payload.try.multiplier !== 2) ||
            (game.settings.finishKind === "MASTERS OUT" &&
              action.payload.try.multiplier === 1));

        if (wrongFinish || remaining < 0) {
          // Remaining points have been overthrown -> Bust Handling
          // TODO handle bust
          const numDartThrown = tries?.length ?? 0;

          const currentRoundDarts =
            tries
              ?.slice(numDartThrown - (numDartThrown % 3 || 3))
              .map((t) => t.try) ?? [];

          currentRoundDarts.forEach((t) => (t.score = "BUST"));

          let triesToAdd = 3 - currentRoundDarts.length;
          while (triesToAdd > 0) {
            triesToAdd--;
            latest.leg?.tries.push({
              player: activePl?.team.name ?? "",
              try: {
                number: 0,
                multiplier: 1,
                points: 0,
                score: "BUST",
              },
              tryNum: (latest.leg.tries.length ?? 0) + 1,
            });
          }
        } else if (remaining === 0) {
          // Player is finished
          activePl && handleFinished(state.fastGame, activePl);
        }
        if (state.fastGame.state === "RUNNING") {
          latest.leg && handleNext(state.fastGame, latest.leg);
        }
      }
    },
    undoX01Try: (state, action: PayloadAction<X01Game>) => {
      const game = action.payload;
      if (!game.dartNightId && state.fastGame) {
        const latest = getLatestLeg(state.fastGame);
        if (latest.leg && latest.leg.tries.length > 0) {
          const undoneTry = latest.leg.tries.pop();
          const activePl = state.fastGame.players.find((p) => p.active);
          if (activePl && undoneTry?.player !== activePl?.team.name) {
            activePl.active = false;
            const next = state.fastGame.players.find(
              (p) => p.team.name === undoneTry?.player
            );
            if (next) {
              next.active = true;
              next.finishRank = 0;
            }
          } else if (activePl) {
            activePl.finishRank = 0;
          }
        }
      }
    },
    allMissed: (state, action: PayloadAction<DartGame>) => {
      const game = action.payload;
      if (!game.dartNightId && state.fastGame) {
        const activePl = state.fastGame.players.find((p) => p.active);
        const latest = getLatestLeg(state.fastGame);
        let missesAdded = 0;
        while (missesAdded < 3) {
          missesAdded++;
          latest.leg?.tries.push({
            player: activePl?.team.name ?? "",
            try: {
              number: 0,
              multiplier: 1,
              points: 0,
              score: "MISS",
            },
            tryNum: (latest.leg.tries.length ?? 0) + 1,
          });
        }
        latest.leg && handleNext(state.fastGame, latest.leg);
      }
    },
  },
});

function handleFinished(game: DartGame, finishedPlayer: DartPlayer) {
  console.log("handle finished");

  const latest = getLatestLeg(game);
  if (latest.leg !== undefined) {
    latest.leg.state = "FINISHED";
    latest.leg.winner = finishedPlayer.team.name;
    const winCount = countObjectOccurrences(latest.set.legs);
    if (Object.values(winCount).includes(game.settings.legs)) {
      latest.set.state = "FINISHED";
      latest.set.winner = "FINISHED";
    } else {
      const finishedIndex = game.players.findIndex(
        (p) => p.team.name === finishedPlayer.team.name
      );
      const nextStarter = game.players[finishedIndex + 1] ?? game.players[0];
      latest.set.legs.push({
        legNum: latest.leg.legNum + 1,
        state: "RUNNING",
        starter: nextStarter.team.name,
        tries: [],
      });
    }

    const setWinCount = countObjectOccurrences(game.sets)
    if (Object.values(setWinCount).includes(game.settings.sets)) {
      
    }
  }

  const rank =
    (_.maxBy(game.players ?? [], (p: DartPlayer) => p.finishRank)?.finishRank ??
      0) + 1;
  finishedPlayer.finishRank = rank;

  const notFinished = game.players.filter((p) => p.finishRank === 0);

  if (notFinished.length === 1) {
    notFinished[0].finishRank = rank + 1;
    game.state = "FINISHED";
  }
  if (notFinished.length === 0) {
    game.state = "FINISHED";
  }
}

function handleNext(game: DartGame, latestLeg: X01Leg) {
  const activePlayer = game.players.find((p) => p.active);
  if (!activePlayer) {
    game.players[0].active = true;
  } else {
    if (
      activePlayer.finishRank > 0 ||
      latestLeg.tries.filter((t) => t.player === activePlayer.team.name)
        .length %
        3 ===
        0
    ) {
      let activeIndex = game.players.findIndex(
        (p) => p.team.name === activePlayer.team.name
      );
      let next = -1;
      while (next === -1) {
        const nextIndex =
          game.players.length - 1 === activeIndex ? 0 : activeIndex + 1;
        if (game.players[nextIndex].finishRank === 0) {
          next = nextIndex;
        } else {
          activeIndex = nextIndex;
        }
      }
      activePlayer.active = false;
      game.players[next].active = true;

      if (next === 0) {
        game.round += 1;
      }
    }
  }
}

function countObjectOccurrences(arr: X01Leg[] | X01Set[]): { [key: string]: number } {
  const frequencyMap: { [key: string]: number } = {};

  // Step 1: Loop through the array and count occurrences
  arr.forEach((obj) => {
    const key = obj.winner;
    frequencyMap[key] = (frequencyMap[key] || 0) + 1;
  });

  return frequencyMap;
}

export const dartConnector = connect(
  (state: RootState) => ({
    dPlayers: state.dart.players,
    dartNights: state.dart.dartNight,
    fastGame: state.dart.fastGame,
    fastGameHistory: state.dart.fastGameHistory,
  }),
  { ...dartSlice.actions },
  undefined,
  {
    areStatesEqual(nextState, prevState) {
      return nextState.dart == prevState.dart;
    },
  }
);

export type DartStoreProps = ConnectedProps<typeof dartConnector>;

export default dartSlice.reducer;
