import {
  Game,
  MatchDay,
  Player,
  Tournament,
  TournamentTeam,
} from "definitions/Definitions";
import { RoundRobin } from "tournament-pairings";

export default function determineTeamMatesAndTeams(
  matchday: MatchDay,
  tournamentTeams: TournamentTeam[],
  activeTournament: Tournament | undefined
): Game[] {
  if (activeTournament === undefined) {
    return [];
  }
  defineTeamMates(matchday, tournamentTeams);
  chooseTeams(matchday, activeTournament, tournamentTeams);
  return generateGames(matchday.id, activeTournament, tournamentTeams);
}

export function defineTeamMates(
  matchday: MatchDay,
  tournamentTeams: TournamentTeam[]
) {
  const players: Player[] = [...matchday.players];
  while (players.length > 0) {
    const teamMates = [];
    const player1 = players.splice(
      Math.floor(Math.random() * players.length),
      1
    )[0];
    teamMates.push(player1);

    if (matchday.mode === "2on2") {
      const usedMates = matchday.tournaments
        .filter((t) => t.state === "FINISHED")
        .flatMap((t) => t.tournamentTeams)
        .filter((tt) => tt.players.map((p) => p.name).includes(player1.name))
        .flatMap((tt) => tt.players);
      const usableMates = players.filter(
        (p) => !usedMates.map((u) => u.name).includes(p.name)
      );
      const player2 = usableMates.splice(
        Math.floor(Math.random() * usableMates.length),
        1
      )[0];
      teamMates.push(player2);
      players.splice(players.indexOf(player2), 1);
    }
    const tTeam: TournamentTeam = { players: [...teamMates] };
    tournamentTeams.push(tTeam);
  }
}

export function chooseTeams(
  matchday: MatchDay,
  activeTournament: Tournament,
  tournamentTeams: TournamentTeam[]
) {
  const teams = [...activeTournament?.useableTeams].filter(
    (t) => !matchday.usedTeams.includes(t)
  );
  console.log(teams);
  tournamentTeams.forEach(
    (tt) =>
      (tt.team = teams.splice(Math.floor(Math.random() * teams.length), 1)[0])
  );
}

export function generatePossibleDraws(
  teamsize: number,
  players: (Player | undefined)[]
) {
  const draws = RoundRobin(players.length, 1, true);
  // draws.map((d) => {
  //   return {team1: {}}
  // })

  console.log(draws);
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
