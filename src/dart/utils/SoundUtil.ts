import useSound from "use-sound";
import clickSound from "../../assets/sounds/click.wav";
import missSound from "../../assets/sounds/miss2.mp3";
import doubleSound from "../../assets/sounds/double.mp3";
import trippleSound from "../../assets/sounds/triple.mp3";
import bustSound from "../../assets/sounds/bust.mp3";
import bullSound from "../../assets/sounds/boonzai.mp3";

export type SoundKind =
  | "CLICK"
  | "MISS"
  | "DOUBLE"
  | "TRIPLE"
  | "BUST"
  | "BULL";

export function usePlaySound(soundKind: SoundKind) {
  return useSound(getSoundFromKind(soundKind));
}

function getSoundFromKind(soundKind: SoundKind) {
  switch (soundKind) {
    case "CLICK":
      return clickSound;
    case "MISS":
      return missSound;
    case "DOUBLE":
      return doubleSound;
    case "TRIPLE":
      return trippleSound;
    case "BUST":
      return bustSound;
    case "BULL":
      return bullSound;
  }
}
