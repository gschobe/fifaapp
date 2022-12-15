import { Dictionary } from "@reduxjs/toolkit";
import { MatchDay, Player } from "definitions/Definitions";

export function getPlayersSortedByPoints(players: Player[]): Player[] {
  const sorted = [...players].sort((p1, p2) => {
    if (p1.stats?.points !== undefined && p2.stats?.points !== undefined) {
      let x = p2.stats.points - p1.stats.points;
      if (x !== 0) {
        return x;
      }

      const p1Diff = p1.stats.goalsScored || 0 - (p1.stats.goalsAgainst || 0);
      const p2Diff = p2.stats.goalsScored || 0 - (p2.stats.goalsAgainst || 0);
      x = p2Diff - p1Diff;
      return x;
    }
    return 0;
  });

  return sorted;
}

export function getPlayersSortedByWinPercentage(
  players: (Player | undefined)[]
): (Player | undefined)[] {
  return [...players].sort((p1, p2) => {
    if (p1 === undefined && p2 === undefined) {
      return 0;
    }
    if (p1 !== undefined && p2 === undefined) {
      return -1;
    }
    if (p1 === undefined && p2 !== undefined) {
      return 1;
    }

    if (
      p1?.stats?.winPercentage !== undefined &&
      p2?.stats?.winPercentage !== undefined
    ) {
      return p2.stats.winPercentage - p1.stats.winPercentage;
    }
    return 0;
  });
}

export function calulateOverallStats(
  matchDays: (MatchDay | undefined)[]
): Dictionary<Player> {
  if (!matchDays) {
    return {};
  }
  const allPlayers = Object.values(matchDays).flatMap((md) => md?.players);
  console.log(allPlayers);

  const playerStats: Dictionary<Player> = {};
  allPlayers.forEach((player) => {
    if (player !== undefined) {
      const pStat = playerStats[player.name] || {
        name: player.name,
        stats: {
          gamesPlayed: 0,
          gamesLost: 0,
          gamesTie: 0,
          gamesWon: 0,
          goalsScored: 0,
          goalsAgainst: 0,
          points: 0,
          winPercentage: 0,
        },
      };

      const stats = pStat.stats;
      if (stats) {
        stats["gamesPlayed"] =
          stats.gamesPlayed || 0 + (player.stats?.gamesPlayed || 0);
        stats["gamesWon"] = stats.gamesWon || 0 + (player.stats?.gamesWon || 0);
        stats["gamesLost"] =
          stats.gamesLost || 0 + (player.stats?.gamesLost || 0);
        stats["gamesTie"] = stats.gamesTie || 0 + (player.stats?.gamesTie || 0);
        stats["goalsScored"] =
          stats.goalsScored || 0 + (player.stats?.goalsScored || 0);
        stats["goalsAgainst"] =
          stats.goalsAgainst || 0 + (player.stats?.goalsAgainst || 0);
        stats["points"] = stats.points || 0 + (player.stats?.points || 0);
        stats["winPercentage"] = Number(
          (stats.gamesWon / stats.gamesPlayed).toFixed(3)
        );
      }
      playerStats[player.name] = pStat;
    }
  });
  return playerStats;
}
