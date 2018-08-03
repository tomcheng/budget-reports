export const sumByProp = key => arr =>
  arr.reduce((acc, curr) => acc + curr[key], 0);
