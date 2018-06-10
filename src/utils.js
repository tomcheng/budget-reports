import camelCase from "lodash/fp/camelCase";
import compose from "lodash/fp/compose";
import curry from "lodash/fp/curry";
import groupBy from "lodash/fp/groupBy";
import isArray from "lodash/fp/isArray";
import isObject from "lodash/fp/isObject";
import mapRaw from "lodash/fp/map";
import mapKeysRaw from "lodash/fp/mapKeys";
import mapValues from "lodash/fp/mapValues";
import pick from "lodash/fp/pick";
import sumBy from "lodash/fp/sumBy";

import { utils } from "ynab";

const map = mapRaw.convert({ cap: false });
const mapKeys = mapKeysRaw.convert({ cap: false });

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

export const mapKeysDeep = curry((iteratee, obj) => {
  if (isArray(obj)) {
    return obj.map(mapKeysDeep(iteratee));
  } else if (isObject(obj)) {
    return mapValues(mapKeysDeep(iteratee))(mapKeys(iteratee)(obj));
  } else {
    return obj;
  }
});

export const camelCaseKeys = mapKeysDeep((val, key) => camelCase(key));

export const formatCurrency = utils.convertMilliUnitsToCurrencyAmount;

export const getStorage = key => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

export const setStorage = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj));
};

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

export const getBudgetLink = ({ budgetId }) => `/budgets/${budgetId}`;

export const getGroupLink = ({ budgetId, categoryGroupId }) =>
  `/budgets/${budgetId}/category-groups/${categoryGroupId}`;

export const getCategoryLink = ({ budgetId, categoryId }) =>
  `/budgets/${budgetId}/categories/${categoryId}`;

export const getPayeeNodes = ({ payeesById, transactions }, divideBy = 1) =>
  compose([
    map((transactions, payeeId) => ({
      ...pick(["id", "name"])(payeesById[payeeId]),
      amount: sumBy("amount")(transactions) / divideBy
    })),
    groupBy("payeeId")
  ])(transactions);
