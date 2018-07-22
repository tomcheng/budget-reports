import { utils } from "ynab";
import camelCase from "lodash/fp/camelCase";
import compose from "lodash/fp/compose";
import curry from "lodash/fp/curry";
import difference from "lodash/fp/difference";
import filter from "lodash/fp/filter";
import groupBy from "lodash/fp/groupBy";
import isArray from "lodash/fp/isArray";
import isObject from "lodash/fp/isObject";
import keys from "lodash/fp/keys";
import mapRaw from "lodash/fp/map";
import mapKeysRaw from "lodash/fp/mapKeys";
import mapValues from "lodash/fp/mapValues";
import matchesProperty from "lodash/fp/matchesProperty";
import mean from "lodash/fp/mean";
import pick from "lodash/fp/pick";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";

const map = mapRaw.convert({ cap: false });
const mapKeys = mapKeysRaw.convert({ cap: false });
const mapValuesWithKey = mapValues.convert({ cap: false });

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

const isIncome = ({
  categoryGroupsById,
  categoriesById,
  transactions
}) => transaction => {
  const { categoryId, payeeId } = transaction;

  if (
    categoryId &&
    categoryGroupsById[categoriesById[categoryId].categoryGroupId]
  ) {
    return false;
  }

  return (
    compose([sumBy("amount"), filter(matchesProperty("payeeId", payeeId))])(
      transactions
    ) > 0
  );
};

export const splitTransactions = ({
  categoryGroupsById,
  categoriesById,
  transactions
}) => {
  const incomeTransactions = filter(
    isIncome({ categoryGroupsById, categoriesById, transactions })
  )(transactions);
  const expenseTransactions = difference(transactions, incomeTransactions);

  return { incomeTransactions, expenseTransactions };
};

export const getMonth = transaction => transaction.date.slice(0, 7);

const standardDeviation = arr => {
  const avg = mean(arr);
  return Math.sqrt(sumBy(num => Math.pow(num - avg, 2))(arr) / arr.length);
};

export const getOutliersBy = f => arr => {
  const values = map(f)(arr);
  const stdDev = standardDeviation(values);
  const avg = mean(values);

  return filter(item => Math.abs(f(item) - avg) > stdDev)(arr);
};

export const getProcessedPayees = simpleMemoize(budget => {
  const { payeesById, transactions } = budget;
  const transactionsByPayee = groupBy("payeeId")(transactions);

  const processedPayeesById = mapValuesWithKey((transactions, payeeId) => ({
    ...payeesById[payeeId],
    transactions
  }))(transactionsByPayee);
  const payeeIds = keys(processedPayeesById);
  const sortedByTransactions = sortBy(
    id => -processedPayeesById[id].transactions.length
  )(payeeIds);
  const sortedByAmount = sortBy(id =>
    sumBy("amount")(processedPayeesById[id].transactions)
  )(payeeIds);

  return {
    payeesById: processedPayeesById,
    sortedByTransactions: sortedByTransactions,
    sortedByAmount: sortedByAmount
  };
});
