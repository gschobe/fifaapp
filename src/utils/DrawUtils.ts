import {
  Game,
  MatchDay,
  Player,
  PossibleDraw,
  Tournament,
  TournamentMode,
  TournamentTeam,
} from "definitions/Definitions";
import { RoundRobin } from "tournament-pairings";
import _ from "lodash";
import { Match } from "tournament-pairings/dist/Match";

export default function determineTeamMatesAndTeams(
  matchday: MatchDay,
  tournamentTeams: TournamentTeam[],
  activeTournament: Tournament | undefined
): { games: Game[]; possibleDraws: PossibleDraw[]; clearUsed: boolean } {
  if (activeTournament === undefined) {
    return { games: [], possibleDraws: [], clearUsed: false };
  }
  const remaining = defineTeamMates(matchday, tournamentTeams);
  const clear = chooseTeams(matchday, activeTournament, tournamentTeams);
  return {
    games: generateGames(
      matchday.id,
      activeTournament,
      tournamentTeams,
      matchday.mode
    ),
    possibleDraws: remaining,
    clearUsed: clear,
  };
}

export function defineTeamMates(
  matchday: MatchDay,
  tournamentTeams: TournamentTeam[]
): PossibleDraw[] {
  const possible = [...matchday.possibleDraws];
  if (matchday.mode === "2on2") {
    const draw = possible.splice(
      Math.floor(Math.random() * possible.length),
      1
    )[0];
    draw.teams.forEach((team) => tournamentTeams.push({ ...team }));
  } else if (matchday.mode === "1on1") {
    matchday.players.forEach((player) =>
      tournamentTeams.push({ players: [{ ...player }] })
    );
  } else if (matchday.mode === "2on2-odd") {
    const players = matchday.players;
    RoundRobin(players.length, 1, true)
      .filter((m) => m.player1 !== null && m.player2 !== null)
      .forEach((t: Match) => {
        const ip1: number = Number(t.player1) - 1;
        const ip2: number = Number(t.player2) - 1;
        tournamentTeams.push({ players: [players[ip1], players[ip2]] });
      });

    console.log(tournamentTeams);
  }

  return possible.length > 0
    ? possible
    : generatePossibleDraws(matchday.players, matchday.mode);
}

export function chooseTeams(
  matchday: MatchDay,
  activeTournament: Tournament,
  tournamentTeams: TournamentTeam[]
): boolean {
  let clearUsedTeams = false;
  const teams = [...activeTournament?.useableTeams].filter(
    (t) => t && !matchday.usedTeams.flatMap((ut) => ut.name).includes(t.name)
  );

  if (teams.length < tournamentTeams.length) {
    teams.splice(0, teams.length);
    teams.push(...[...activeTournament.useableTeams]);
    clearUsedTeams = true;
  }

  tournamentTeams.forEach(
    (tt) =>
      (tt.team = teams.splice(Math.floor(Math.random() * teams.length), 1)[0])
  );

  return clearUsedTeams;
}

export function generatePossibleDraws(
  players: (Player | undefined)[],
  mode: TournamentMode = "2on2"
): PossibleDraw[] {
  if (mode !== "2on2") {
    return [];
  }
  const possible: PossibleDraw[] = [];
  const draws = RoundRobin(players.length, 1, true);

  const groups = _(draws)
    .groupBy((draw) => draw.round)
    .value();

  Object.values(groups).map((group: any) => {
    const teams: TournamentTeam[] = [];
    group.map((team: Match) => {
      const p1 = players[Number(team.player1) - 1];
      const p2 = players[Number(team.player2) - 1];
      if (p1 && p2) {
        teams.push({ players: [p1, p2] });
      }
    });
    possible.push({ teams: teams });
  });

  console.log(possible);
  return possible;
}

export function generateGames(
  matchdayId: string,
  activeTournament: Tournament,
  tournamentTeams: TournamentTeam[],
  mode: TournamentMode
): Game[] {
  const sched = RoundRobin(tournamentTeams.length, 1, true);

  if (mode === "2on2-odd") {
    const filteredGames = sched
      .filter((g: Match) => g.player1 !== null && g.player2 !== null)
      .filter((g: Match) => {
        console.log(
          g.player1,
          " and ",
          g.player2,
          " of ",
          tournamentTeams.length
        );
        const t1 = tournamentTeams[Number(g.player1) - 1 || 0];
        const t2 = tournamentTeams[Number(g.player2) - 1 || 0];
        const players = t1.players.concat(
          t2.players.filter((p) => t1.players.indexOf(p) < 0)
        );
        return players.length === 4;
      })
      .map((g) => {
        const t1_id = Number(g.player1);
        const t2_id = Number(g.player2);
        const t1: TournamentTeam = tournamentTeams[t1_id - 1];
        const t2: TournamentTeam = tournamentTeams[t2_id - 1];
        return {
          t1: { team: t1_id, players: t1 },
          t2: { team: t2_id, players: t2 },
          pause: activeTournament.players
            .filter(
              (p) =>
                !t1.players
                  .concat(t2.players)
                  .flatMap((pl) => pl.name)
                  .includes(p.name)
            )
            .at(0),
        };
      });

    let pause = 0;
    let lastTeams: number[] = [];
    const sequencedGames: Game[] = [];
    const numGames = filteredGames.length;
    for (let i = 1; sequencedGames.length < numGames; i++) {
      console.log("sequence: ", i);
      console.log(lastTeams);
      const game = filteredGames.find(
        (g) =>
          g.pause?.name === activeTournament.players[pause].name &&
          !sameTeam(g.t1.team, g.t2.team, lastTeams)
      );
      console.log(game?.t1.team, " ", game?.t2.team);
      if (game) {
        filteredGames.splice(filteredGames.indexOf(game), 1);
        sequencedGames.push({
          matchdayId: matchdayId,
          tournamentId: activeTournament.id,
          sequence: sequencedGames.length + 1,
          homePlayer: game.t1.players,
          awayPlayer: game.t2.players,
          state: "OPEN",
        });
        lastTeams = [game.t1.team, game.t2.team];
      }
      pause === activeTournament.players.length - 1 ? (pause = 0) : pause++;
    }

    sequencedGames[0].state = "UPCOMING";
    return sequencedGames;
  } else {
    const games: Game[] = sched
      .filter((s) => s.player1 !== null && s.player2 !== null)
      .map((s, index) => {
        return {
          matchdayId: matchdayId,
          tournamentId: activeTournament.id,
          sequence: index + 1,
          homePlayer: tournamentTeams[Number(s.player1) - 1],
          awayPlayer: tournamentTeams[Number(s.player2) - 1],
          state: "OPEN",
        };
      });

    if (activeTournament.withSecondRound) {
      const secondRound: Game[] = sched
        .filter((s) => s.player1 !== null && s.player2 !== null)
        .map((s, index) => {
          return {
            matchdayId: matchdayId,
            tournamentId: activeTournament.id,
            sequence: index + 1 + games.length,
            homePlayer: tournamentTeams[Number(s.player2) - 1],
            awayPlayer: tournamentTeams[Number(s.player1) - 1],
            state: "OPEN",
          };
        });
      games.push(...secondRound);
    }
    games[0].state = "UPCOMING";
    return games;
  }
}

function sameTeam(t1: number, t2: number, lastTeams: number[]): boolean {
  return lastTeams.includes(t1) || lastTeams.includes(t2);
}
