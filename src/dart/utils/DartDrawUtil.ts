import {
  ATCGame,
  ATCSettings,
  CricketGame,
  CricketSettings,
  DPlayer,
  DartNight,
  DartPossibleDraw,
  DartTeam,
  DartTournament,
  EliminationGame,
  EliminationSettings,
  GameSettings,
  ShooterGame,
  ShooterSettings,
  TeamMode,
  X01Game,
  X01GameSettings,
} from "dart/Definitions";
import { RoundRobin } from "tournament-pairings";
// import { Match } from "tournament-pairings/dist/Match";
// import { generatePossibleDraws } from "utils/DrawUtils";
import { defaultDartBoardNumbers } from "dart/assets/numbers";
import { DartGame } from "store/DartStore";
import {
  getNewATCPlayer,
  getNewCricketPlayer,
  getNewEliminationPlayer,
  getNewShooterPlayer,
  getNewX01Player,
} from "./DartUtil";
import { Match } from "tournament-pairings/dist/Match";
import _ from "lodash";

export default function determineTeamMates(
  dartNight: DartNight,
  tournamentTeams: DartTeam[],
  activeTournament: DartTournament | undefined
): {
  games: DartGame[];
  possibleDraws: DartPossibleDraw[];
} {
  if (activeTournament === undefined) {
    return { games: [], possibleDraws: [] };
  }
  const remaining = defineTeamMates(
    dartNight,
    activeTournament,
    tournamentTeams
  );
  return {
    games: generateGames(dartNight.id, activeTournament, tournamentTeams),
    possibleDraws: remaining,
  };
}

export function defineTeamMates(
  dartNight: DartNight,
  dartTournament: DartTournament,
  tournamentTeams: DartTeam[]
): DartPossibleDraw[] {
  const possible =
    dartNight.possibleDraws.length > 0
      ? [...dartNight.possibleDraws]
      : generatePossibleDraws(
          dartNight.players,
          dartTournament.tournamentSettings.teamMode
        );
  if (dartTournament.tournamentSettings.teamMode === "TEAM") {
    const draw = possible.splice(
      Math.floor(Math.random() * possible.length),
      1
    )[0];
    draw.dartTeams.forEach((team) => tournamentTeams.push({ ...team }));
  } else if (dartTournament.tournamentSettings.teamMode === "SINGLE") {
    dartNight.players.forEach((player) =>
      tournamentTeams.push({ name: player.name, players: [{ ...player }] })
    );
  }

  return possible.length > 0
    ? possible
    : generatePossibleDraws(
        dartNight.players,
        dartTournament.tournamentSettings.teamMode
      );
}

function generatePossibleDraws(
  players: (DPlayer | undefined)[],
  mode: TeamMode = "TEAM"
): DartPossibleDraw[] {
  if (mode !== "TEAM") {
    return [];
  }
  const possible: DartPossibleDraw[] = [];
  const draws = RoundRobin(players.length, 1, true);

  const groups = _(draws)
    .groupBy((draw) => draw.round)
    .value();

  Object.values(groups).map((group: any) => {
    const teams: DartTeam[] = [];
    group.map((team: Match) => {
      const p1 = players[Number(team.player1) - 1];
      const p2 = players[Number(team.player2) - 1];
      if (p1 && p2) {
        teams.push({ name: `${p1.name}-${p2.name}`, players: [p1, p2] });
      }
    });
    possible.push({ dartTeams: teams });
  });

  console.log(possible);
  return possible;
}

export function generateGames(
  dartNightId: number,
  activeTournament: DartTournament,
  tournamentTeams: DartTeam[]
): DartGame[] {
  const sched = RoundRobin(tournamentTeams.length, 1, true);

  // if (mode === "TEAM" && tournamentTeams.length % 2 !== 0) {
  // const filteredGames = sched
  //   .filter((g: Match) => g.player1 !== null && g.player2 !== null)
  //   .filter((g: Match) => {
  //     console.log(
  //       g.player1,
  //       " and ",
  //       g.player2,
  //       " of ",
  //       tournamentTeams.length
  //     );
  //     const t1 = tournamentTeams[Number(g.player1) - 1 || 0];
  //     const t2 = tournamentTeams[Number(g.player2) - 1 || 0];
  //     const players = t1.players.concat(
  //       t2.players.filter((p) => t1.players.indexOf(p) < 0)
  //     );
  //     return players.length === 4;
  //   })
  //   .map((g) => {
  //     const t1_id = Number(g.player1);
  //     const t2_id = Number(g.player2);
  //     const t1: DartTeam = tournamentTeams[t1_id - 1];
  //     const t2: DartTeam = tournamentTeams[t2_id - 1];
  //     return {
  //       t1: { team: t1_id, players: t1 },
  //       t2: { team: t2_id, players: t2 },
  //       pause: activeTournament.players
  //         .filter(
  //           (p) =>
  //             !t1.players
  //               .concat(t2.players)
  //               .flatMap((pl) => pl.name)
  //               .includes(p.name)
  //         )
  //         .at(0),
  //     };
  //   });

  // let pause = 0;
  // let lastTeams: number[] = [];
  // const sequencedGames: (X01Game | CricketGame | ATCGame)[] = [];
  // const numGames = filteredGames.length;
  // for (let i = 1; sequencedGames.length < numGames; i++) {
  //   console.log("sequence: ", i);
  //   console.log(lastTeams);
  //   const game = filteredGames.find(
  //     (g) =>
  //       g.pause?.name === activeTournament.players[pause].name &&
  //       !sameTeam(g.t1.team, g.t2.team, lastTeams)
  //   );
  //   console.log(game?.t1.team, " ", game?.t2.team);
  //   if (game) {
  //     filteredGames.splice(filteredGames.indexOf(game), 1);
  //     sequencedGames.push({
  //       matchdayId: matchdayId,
  //       tournamentId: activeTournament.id,
  //       sequence: sequencedGames.length + 1,
  //       homePlayer: game.t1.players,
  //       awayPlayer: game.t2.players,
  //       state: "OPEN",
  //     });
  //     lastTeams = [game.t1.team, game.t2.team];
  //   }
  //   pause === activeTournament.players.length - 1 ? (pause = 0) : pause++;
  // }

  // sequencedGames[0].state = "UPCOMING";
  // return sequencedGames;
  // } else {
  const games: DartGame[] = sched
    .filter((s) => s.player1 !== null && s.player2 !== null)
    .map((s, index) => {
      const team1Index = typeof s.player1 === "number" ? s.player1 - 1 : 0;
      const team2Index = typeof s.player2 === "number" ? s.player2 - 1 : 0;
      return getGame(
        dartNightId,
        activeTournament.gameSettings,
        [tournamentTeams[team1Index], tournamentTeams[team2Index]],
        index,
        activeTournament.id
      );
    });

  games[0].state = "UPCOMING";
  return games;
  // }
}

export function getFastGame(gameSettings: GameSettings, players: DartTeam[]) {
  let game: DartGame;
  switch (gameSettings.choosenGame) {
    case "X01":
      game = getNewX01Game(gameSettings.x01, players, 1);
      break;
    //   return getNewX01Game(tournament.gameSettings.x01, players, sequence);
    case "CRICKET":
      game = getNewCricketGame(gameSettings.cricket, players, 1);
      break;
    case "ATC":
      game = getNewAtcGame(gameSettings.atc, players, 1);
      break;
    case "SHOOTER":
      game = getNewShooterGame(gameSettings.shooter, players, 1);
      break;
    case "ELIMINATION":
      game = getNewEliminationGame(gameSettings.elimination, players, 1);
      break;
    default:
      game = getNewX01Game(gameSettings.x01, players, 1);
  }
  game.state = "RUNNING";
  return game;
}

export function getGameForDartNight(
  gameSettings: GameSettings,
  dartNightId: number,
  players: DartTeam[],
  sequence: number
) {
  return getGame(dartNightId, gameSettings, players, sequence);
}

function getGame(
  dartNightId: number,
  gameSettings: GameSettings,
  players: DartTeam[],
  sequence: number,
  tournamentId?: number
) {
  let game;
  switch (gameSettings.choosenGame) {
    case "X01":
      game = getNewX01Game(gameSettings.x01, players, sequence);
      break;
    //   return getNewX01Game(tournament.gameSettings.x01, players, sequence);
    case "CRICKET":
      game = getNewCricketGame(gameSettings.cricket, players, sequence);
      break;
    case "ATC":
      game = getNewAtcGame(gameSettings.atc, players, sequence);
      break;
    case "SHOOTER":
      game = getNewShooterGame(gameSettings.shooter, players, sequence);
      break;
    case "ELIMINATION":
      game = getNewEliminationGame(gameSettings.elimination, players, sequence);
      break;
  }
  game.dartNightId = dartNightId;
  game.dartTournamentId = tournamentId;
  return game;
}

export function getNewX01Game(
  gameSettings: X01GameSettings,
  players: DartTeam[],
  sequence: number
): X01Game {
  return {
    id: new Date().getTime(),
    type: "X01",
    settings: gameSettings,
    leg: 1,
    set: 1,
    round: 1,
    players: players.map((p, idx) =>
      getNewX01Player(gameSettings.kind, p, idx === 0)
    ),
    finishedPlayers: [],
    state: "OPEN",
    sequence: sequence,
  };
}
function getNewCricketGame(
  gameSettings: CricketSettings,
  players: DartTeam[],
  sequence: number
): CricketGame {
  return {
    id: new Date().getTime(),
    type: "Cricket",
    leg: 1,
    set: 1,
    settings: gameSettings,
    round: 1,
    players: players.map((p, idx) =>
      getNewCricketPlayer(p, gameSettings, idx === 0)
    ),
    finishedPlayers: [],
    state: "OPEN",
    sequence: sequence,
  };
}

function getNewAtcGame(
  gameSettings: ATCSettings,
  players: DartTeam[],
  sequence: number
): ATCGame {
  return {
    id: new Date().getTime(),
    type: "ATC",
    settings: gameSettings,
    leg: 1,
    set: 1,
    round: 1,
    players: players.map((p, idx) =>
      getNewATCPlayer(p, gameSettings, idx === 0)
    ),
    finishedPlayers: [],
    state: "OPEN",
    sequence: sequence,
  };
}

function getNewEliminationGame(
  gameSettings: EliminationSettings,
  players: DartTeam[],
  sequence: number
): EliminationGame {
  return {
    id: new Date().getTime(),
    type: "Elimination",
    settings: gameSettings,
    leg: 1,
    set: 1,
    round: 1,
    players: players.map((p, idx) =>
      getNewEliminationPlayer(p, gameSettings, idx === 0)
    ),
    finishedPlayers: [],
    state: "OPEN",
    sequence: sequence,
  };
}
function getNewShooterGame(
  gameSettings: ShooterSettings,
  players: DartTeam[],
  sequence: number
): ShooterGame {
  const settings = {
    ...gameSettings,
    numbers: getShooterNumbers(gameSettings),
  };
  return {
    id: new Date().getTime(),
    type: "Shooter",
    settings: settings,
    round: 1,
    leg: 1,
    set: 1,
    players: players.map((p, idx) =>
      getNewShooterPlayer(p, settings, idx === 0)
    ),
    finishedPlayers: [],
    state: "OPEN",
    sequence: sequence,
  };
}

export function getShooterNumbers(gameSettings: ShooterSettings): number[] {
  const numbers = [];
  switch (gameSettings.numberMode) {
    case "RANDOM": {
      const available = [...defaultDartBoardNumbers];
      while (numbers.length < gameSettings.rounds) {
        numbers.push(
          available.splice(Math.floor(Math.random() * available.length), 1)[0]
        );
      }
      return numbers;
    }
    case "SELECTED":
      return [...gameSettings.numbers];
  }
}
