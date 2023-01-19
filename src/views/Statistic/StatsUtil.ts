import { Dictionary } from "@reduxjs/toolkit";
import { Game, MatchDay, Player, TeamStats } from "definitions/Definitions";

export interface TeamStatistics {
  numberOfTeams?: number;
  mostGames?: TeamStats;
  mostWon?: TeamStats;
  leastWon?: TeamStats;
}

export interface PlayerStatistics {
  mppg?: Player;
  lppg?: Player;
  gpg?: Player;
  gapg?: Player;
}

export interface GameStatistics {
  numTies?: number;
  mostGoals?: { goals: number; games: Game[] };
  highestDif?: { dif: number; games: Game[] };
}

export interface Statistics {
  team: TeamStatistics;
  game: GameStatistics;
  mostWins?: { name: string[]; wins: number };
  leastWins?: { name: string[]; wins: number };
  mostLoss?: { name: string[]; losses: number };
  leastLoss?: { name: string[]; losses: number };
  mostMdWins?: { name: string[]; wins: number };
}

export function getPlayerStats(
  players: (Player | undefined)[]
): PlayerStatistics {
  const sorted = players?.sort(
    (p1, p2) =>
      (p2?.stats?.pointsPerGame || 0) - (p1?.stats?.pointsPerGame || 0)
  );
  const mppg = sorted[0];
  const lppg = sorted[sorted.length - 1];
  sorted.sort(
    (gpg1, gpg2) =>
      (gpg2?.stats?.goalsPerGame || 0) - (gpg1?.stats?.goalsPerGame || 0)
  );
  const gpg = sorted[0];
  sorted.sort(
    (gpg1, gpg2) =>
      (gpg2?.stats?.goalsAgainstPerGame || 0) -
      (gpg1?.stats?.goalsAgainstPerGame || 0)
  );
  const gapg = sorted[0];
  return {
    mppg: mppg,
    lppg: lppg,
    gpg: gpg,
    gapg: gapg,
  };
}

export function getTeamAndGameStats(
  selectedMatchdays: (MatchDay | undefined)[],
  players: (Player | undefined)[]
): Statistics {
  const stats = new Map<string, TeamStats>();

  const games = selectedMatchdays?.flatMap((md) =>
    md?.tournaments.flatMap((t) => t.games)
  );
  const teamsSet = new Set();
  let numTies = 0;
  const mostGoals: { goals: number; games: Game[] } = { goals: 0, games: [] };
  const mostDif: { dif: number; games: Game[] } = { dif: 0, games: [] };

  // dictionary for wins calculation
  const mostWins: Dictionary<{ name: string; win: number }> = {};
  if (players) {
    players.forEach((p) => {
      if (p) {
        mostWins[p.name] = { name: p.name, win: 0 };
      }
    });
  }

  // dictionary for games lost calculation
  const mostLosses: Dictionary<{ name: string; loss: number }> = {};
  if (players) {
    players.forEach((p) => {
      if (p) {
        mostLosses[p.name] = { name: p.name, loss: 0 };
      }
    });
  }

  games?.forEach((g) => {
    if (g !== undefined && !["OPEN", "UPCOMING"].includes(g.state)) {
      const home = g.homePlayer.team?.name;
      teamsSet.add(home);
      const away = g.awayPlayer.team?.name;
      teamsSet.add(away);
      calcTeamStats(home, stats, g, "home");
      calcTeamStats(away, stats, g, "away");

      if (
        g.goalsAway !== undefined &&
        g.goalsHome !== undefined &&
        g.goalsHome === g.goalsAway
      ) {
        numTies = numTies + 1;
        console.log(g.sequence, "/", g.matchdayId);
      } else if ((g?.goalsHome || 0) > (g?.goalsAway || 0)) {
        g.homePlayer.players.forEach((p) => {
          increaseWins(mostWins, p);
        });
        g.awayPlayer.players.forEach((p) => {
          increaseLoss(mostLosses, p);
        });
      } else if ((g?.goalsHome || 0) < (g?.goalsAway || 0)) {
        g.awayPlayer.players.forEach((p) => {
          increaseWins(mostWins, p);
        });
        g.homePlayer.players.forEach((p) => {
          increaseLoss(mostLosses, p);
        });
      }

      const goals = (g.goalsHome || 0) + (g.goalsAway || 0);
      const goalDif = Math.abs((g.goalsHome || 0) - (g.goalsAway || 0));
      if (mostGoals.goals < goals) {
        mostGoals.goals = goals;
        mostGoals.games = [g];
      } else if (mostGoals.goals === goals) {
        mostGoals.games.push(g);
      }
      if (mostDif.dif < goalDif) {
        mostDif.dif = goalDif;
        mostDif.games = [g];
      } else if (mostDif.dif === goalDif) {
        mostDif.games.push(g);
      }
    }
  });

  const numGames = Array.from(stats.values()).sort(
    (t1, t2) => t2.games - t1.games
  );
  const numWon = Array.from(stats.values()).sort((t1, t2) => {
    let x: number = t2.winPercentage - t1.winPercentage;
    if (x !== 0) {
      return x;
    }
    x = t2.tie - t1.tie;
    if (x !== 0) {
      return x;
    }
    return t1.lost - t2.lost;
  });

  const playerArray = Object.values(players);
  const maxWin = Math.max(...playerArray.map((p) => p?.stats?.gamesWon || 0));
  const maxWins = playerArray.filter((p) => p?.stats?.gamesWon === maxWin);

  const minWin = Math.min(...Object.values(mostWins).map((mw) => mw?.win || 0));
  const minWins = Object.values(mostWins).filter((mw) => mw?.win === minWin);
  const maxLoss = Math.max(
    ...Object.values(mostLosses).map((ml) => ml?.loss || 0)
  );
  const maxLosses = Object.values(mostLosses).filter(
    (ml) => ml?.loss === maxLoss
  );
  const minLoss = Math.min(
    ...Object.values(mostLosses).map((mw) => mw?.loss || 0)
  );
  const minLosses = Object.values(mostLosses).filter(
    (mw) => mw?.loss === minLoss
  );
  const mostMdWins = getMostMdWinners(selectedMatchdays);

  return {
    team: {
      numberOfTeams: teamsSet.size,
      mostGames: numGames[0],
      mostWon: numWon[0],
      leastWon: numWon[numWon.length - 1],
    },
    game: { numTies: numTies, mostGoals: mostGoals, highestDif: mostDif },
    mostWins: {
      wins: isFinite(maxWin) ? maxWin : 0,
      name: maxWins.map((mw) => mw?.name || ""),
    },
    leastWins: {
      wins: isFinite(minWin) ? minWin : 0,
      name: minWins.map((mw) => mw?.name || ""),
    },
    mostLoss: {
      losses: isFinite(maxLoss) ? maxLoss : 0,
      name: maxLosses.map((ml) => ml?.name || ""),
    },
    leastLoss: {
      losses: isFinite(minLoss) ? minLoss : 0,
      name: minLosses.map((ml) => ml?.name || ""),
    },
    mostMdWins: {
      wins: mostMdWins[0]?.win || 0,
      name: mostMdWins.map((mw) => mw?.name || ""),
    },
  };
}

function getMostMdWinners(selectedMatchdays: (MatchDay | undefined)[]) {
  const mdWinners = selectedMatchdays
    .filter((md) => md?.state === "FINISHED")
    .flatMap((md) => md?.players.filter((p) => p.rank === 1));
  const count: Dictionary<{ name: string; win: number }> = {};
  mdWinners.forEach((mdw) => {
    if (mdw) {
      increaseWins(count, mdw);
    }
  });
  const maxMdWin = Math.max(...Object.values(count).map((mw) => mw?.win || 0));
  const maxMdWins = Object.values(count).filter((mw) => mw?.win === maxMdWin);
  return maxMdWins;
}

function increaseWins(
  mostWins: Dictionary<{ name: string; win: number }>,
  p: Player
) {
  if (p) {
    const pe = mostWins[p.name];
    if (pe) {
      mostWins[p.name] = { name: pe.name, win: pe.win + 1 };
    } else {
      mostWins[p.name] = { name: p.name, win: 1 };
    }
  }
}

function increaseLoss(
  mostLosses: Dictionary<{ name: string; loss: number }>,
  p: Player
) {
  if (p) {
    const pe = mostLosses[p.name];
    if (pe) {
      mostLosses[p.name] = { name: pe.name, loss: pe.loss + 1 };
    } else {
      mostLosses[p.name] = { name: p.name, loss: 1 };
    }
  }
}

function calcTeamStats(
  name: string | undefined,
  stats: Map<string, TeamStats>,
  g: Game | undefined,
  homeAway: "home" | "away"
) {
  if (name) {
    const tstat =
      stats.get(name) !== undefined
        ? stats.get(name)
        : {
            name: name,
            games: 0,
            won: 0,
            tie: 0,
            lost: 0,
            winPercentage: 0,
          };

    if (tstat) {
      tstat.games = tstat.games + 1;
      if ((g?.goalsHome || 0) > (g?.goalsAway || 0)) {
        if (homeAway === "home") {
          tstat.won = tstat.won + 1;
        } else {
          tstat.lost = tstat.lost + 1;
        }
      } else if ((g?.goalsHome || 0) < (g?.goalsAway || 0)) {
        if (homeAway === "home") {
          tstat.lost = tstat.lost + 1;
        } else {
          tstat.won = tstat.won + 1;
        }
      } else {
        tstat.tie = tstat.tie + 1;
      }
      tstat.winPercentage = tstat.won / tstat.games;
      stats.set(name, tstat);
    }
  }
}
