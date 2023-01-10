import { MatchDay } from "definitions/Definitions";

export function downLoadMatchDayData(matchDays: (MatchDay | undefined)[]) {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(matchDays)
  )}`;
  const element = document.createElement("a");
  element.href = jsonString;
  element.download = "matchData.json";
  element.click();
}
