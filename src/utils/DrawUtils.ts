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
  activeTournament: Tournament
): Game[] {
  defineTeamMates(matchday, tournamentTeams);
  chooseTeams(activeTournament, tournamentTeams);
  return generateGames(activeTournament, tournamentTeams);
}

export function defineTeamMates(
  matchday: MatchDay,
  tournamentTeams: TournamentTeam[]
) {
  const players: Player[] = [...matchday.players];
  while (players.length > 0) {
    const p1 = players.splice(Math.floor(Math.random() * players.length), 1)[0];
    const p2 = players.splice(Math.floor(Math.random() * players.length), 1)[0];
    const tTeam: TournamentTeam = { players: [p1, p2] };
    tournamentTeams.push(tTeam);
  }
}

export function chooseTeams(
  activeTournament: Tournament,
  tournamentTeams: TournamentTeam[]
) {
  const teams = [...activeTournament?.useableTeams];
  tournamentTeams.forEach(
    (tt) =>
      (tt.team = teams.splice(Math.floor(Math.random() * teams.length), 1)[0])
  );
}

export function generateGames(
  activeTournament: Tournament,
  tournamentTeams: TournamentTeam[]
): Game[] {
  const sched = RoundRobin(tournamentTeams.length, 1, true);

  const games: Game[] = sched
    .filter((s) => s.player1 !== null && s.player2 !== null)
    .map((s, index) => {
      return {
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
          sequence: index + 1 + games.length,
          homePlayer: tournamentTeams[Number(s.player2) - 1],
          awayPlayer: tournamentTeams[Number(s.player1) - 1],
          state: "OPEN",
        };
      });
    games.push(...secondRound);
  }
  return games;
}
