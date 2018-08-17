export const groupBy = func => arr => {
  const grouped = {};
  arr.forEach(obj => {
    const key = func(obj);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(obj);
  });
  return grouped;
};

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

export const simpleMemoize = func => {
  let lastArgs = null;
  let lastResult = null;
  return (...args) => {
    if (
      lastArgs !== null &&
      lastArgs.length === args.length &&
      args.every((value, index) => value === lastArgs[index])
    ) {
      return lastResult;
    }
    lastArgs = args;
    lastResult = func(...args);
    return lastResult;
  };
};

export const notAny = predicates => arg =>
  predicates.every(predicate => !predicate(arg));

export const upsertBy = (arr, key, obj, updater = (prev, curr) => curr) => {
  let exists = false;
  const newArr = arr.map(item => {
    if (item[key] === obj[key]) {
      exists = true;
      return updater(item, obj);
    }
    return item;
  });
  return exists ? newArr : newArr.concat(obj);
};
