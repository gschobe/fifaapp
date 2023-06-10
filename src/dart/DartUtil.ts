import { isNumber } from "lodash";
import { X01Kind, X01Player } from "./Definitions";
import { possibleOuts } from "./assets/data";

export function calculateAverage(
  player: X01Player,
  startPoints: number
): number {
  const dartsThrown = getNumDartsThrown(player);
  if (dartsThrown === 0) {
    return 0;
  }
  const thrownPoints = startPoints - player.score.remaining;
  console.log(thrownPoints);
  const dartAvg = thrownPoints / dartsThrown;
  console.log(dartAvg);

  return Number((dartAvg * 3).toFixed(2));
}

export function getNumDartsThrown(player: X01Player): number {
  return player.score.threeDartScore
    .flatMap((s) => s)
    .filter((s) => isNumber(s)).length;
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
  name: string,
  active = false
): X01Player {
  return {
    name: name,
    active: active,
    finishRank: 0,
    score: {
      remaining: kind,
      average: 0,
      threeDartScore: [["-", "-", "-"]],
    },
  };
}
