import { Dictionary } from "@reduxjs/toolkit";
import { Game, MatchDay, Player } from "definitions/Definitions";
import { calculatePoints, updateStats } from "store/FifaGamesReducer";

export function getPlayersSortedByPoints(
  players: Player[],
  calculateRank: boolean = true,
  liveGame?: Game
): Player[] {
  const ps = players.map((player) => ({ ...player }));
  if (liveGame) {
    const { homePoints, awayPoints } = calculatePoints(
      liveGame.goalsHome || 0,
      liveGame.goalsAway || 0
    );
    const homeP = ps.filter((p) =>
      liveGame.homePlayer.players.flatMap((p) => p.name).includes(p.name)
    );
    const awayP = ps.filter((p) =>
      liveGame.awayPlayer.players.flatMap((p) => p.name).includes(p.name)
    );

    homeP.forEach((p) => {
      const stats = { ...p.stats };
      updateStats("home", stats, liveGame, homePoints);
      p.stats = stats;
    });

    awayP.forEach((p) => {
      const stats = { ...p.stats };
      updateStats("away", stats, liveGame, awayPoints);
      p.stats = stats;
    });
  }
  const sorted = ps.sort((p1, p2) => {
    return comparePlayers(p1, p2);
  });

  if (calculateRank) {
    calculateRanks(sorted);
  }

  return sorted;
}

export function calculateRanks(sorted: Player[]) {
  let prevPlayer: Player | undefined = undefined;
  sorted.forEach((p, index) => {
    const prev = p.rank;
    p = {
      ...p,
      previousRank: prev,
      rank:
        prevPlayer && comparePlayers(prevPlayer, p) === 0
          ? prevPlayer.rank
          : index + 1,
    };
    sorted[index] = p;
    prevPlayer = p;
  });
}

export function comparePlayers(p1: Player, p2: Player): number {
  if (p1.stats?.points !== undefined && p2.stats?.points !== undefined) {
    // points
    let x = p2.stats.points - p1.stats.points;
    if (x !== 0) {
      return x;
    }

    // goal difference
    const p1Diff = p1.stats.goalsScored || 0 - (p1.stats.goalsAgainst || 0);
    const p2Diff = p2.stats.goalsScored || 0 - (p2.stats.goalsAgainst || 0);
    x = p2Diff - p1Diff;
    if (x !== 0) {
      return x;
    }

    // goals scored
    x = (p2.stats.goalsScored || 0) - (p1.stats.goalsScored || 0);
    return x;
  }
  return 0;
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
  matchDays: (MatchDay | undefined)[],
  players: (Player | undefined)[]
): Dictionary<Player> {
  if (!matchDays || matchDays.length === 0) {
    const newplayers: Dictionary<Player> = {};
    players.forEach((p) => {
      if (p) {
        newplayers[p.name] = {
          ...p,
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
      }
    });

    return newplayers;
  }
  const allPlayers = Object.values(matchDays).flatMap((md) => md?.players);

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
