export const defaultDartBoardNumbers = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  25,
];
export const clockwiseDartBoardNumbers = [
  1,
  18,
  4,
  13,
  6,
  10,
  15,
  2,
  17,
  3,
  19,
  7,
  16,
  8,
  11,
  14,
  9,
  12,
  5,
  20,
];
export const counterclockwiseDartBoardNumbers = [
  5,
  12,
  9,
  14,
  11,
  8,
  16,
  7,
  19,
  3,
  17,
  2,
  15,
  10,
  6,
  13,
  4,
  18,
  1,
  20,
];

export const defaultCricketNumbers = [20, 19, 18, 17, 16, 15, 25];

export const first7 = defaultDartBoardNumbers.filter((n) => n <= 7);
export const middle7 = defaultDartBoardNumbers.filter((n) => n > 7 && n <= 14);
export const last7 = defaultDartBoardNumbers.filter((n) => n > 14);
