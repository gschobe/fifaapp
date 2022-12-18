import {
  Game,
  MatchDay,
  Player,
  PossibleDraw,
  Tournament,
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
    games: generateGames(matchday.id, activeTournament, tournamentTeams),
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
  }

  return possible.length > 0
    ? possible
    : generatePossibleDraws(matchday.players);
}

export function chooseTeams(
  matchday: MatchDay,
  activeTournament: Tournament,
  tournamentTeams: TournamentTeam[]
): boolean {
  let clearUsedTeams = false;
  const teams = [...activeTournament?.useableTeams].filter(
    (t) => !matchday.usedTeams.flatMap((ut) => ut.name).includes(t.name)
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
  players: (Player | undefined)[]
): PossibleDraw[] {
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
  tournamentTeams: TournamentTeam[]
): Game[] {
  const sched = RoundRobin(tournamentTeams.length, 1, true);

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
