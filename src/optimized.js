export const groupByProp = key => arr => {
  const grouped = {};
  arr.forEach(obj => {
    if (!grouped[obj[key]]) {
      grouped[obj[key]] = [];
    }
    grouped[obj[key]].push(obj);
  });
  return grouped;
};

export const sumBy = func => arr =>
  arr.reduce((acc, curr) => acc + func(curr), 0);

export const sumByProp = key => arr =>
  arr.reduce((acc, curr) => acc + curr[key], 0);
