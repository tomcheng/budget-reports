import { utils } from "ynab";
import moment from "moment";
import { groupByProp, sumBy, sumByProp } from "./optimized";
import anyPass from "lodash/fp/anyPass";
import camelCase from "lodash/fp/camelCase";
import compose from "lodash/fp/compose";
import curry from "lodash/fp/curry";
import difference from "lodash/fp/difference";
import filter from "lodash/fp/filter";
import isArray from "lodash/fp/isArray";
import isObject from "lodash/fp/isObject";
import mapRaw from "lodash/fp/map";
import mapKeysRaw from "lodash/fp/mapKeys";
import mapValues from "lodash/fp/mapValues";
import mean from "lodash/fp/mean";
import pick from "lodash/fp/pick";
import reject from "lodash/fp/reject";
import get from "lodash/fp/get";

const map = mapRaw.convert({ cap: false });
const mapKeys = mapKeysRaw.convert({ cap: false });

const PAYEES_TO_EXCLUDE = [
  "Starting Balance",
  "Reconciliation Balance Adjustment"
];

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

export const getPayeeNodes = ({ payeesById, transactions }, divideBy = 1) =>
  compose([
    map((transactions, payeeId) => ({
      ...(payeesById[payeeId]
        ? pick(["id", "name"])(payeesById[payeeId])
        : { id: "no-payee", name: "(no payee)" }),
      amount: sumByProp("amount")(transactions) / divideBy
    })),
    groupByProp("payeeId")
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
    compose([
      sumByProp("amount"),
      transactions =>
        transactions.filter(transaction => transaction.payeeId === payeeId)
    ])(transactions) > 0
  );
};

const isTransfer = ({ accountsById, investmentAccounts }) => transaction => {
  const { accountId, transferAccountId } = transaction;
  const account = accountsById[accountId];

  if (!account.onBudget) {
    return true;
  }

  if (!transferAccountId) {
    return false;
  }

  const transferAccount = accountsById[transferAccountId];

  if (transferAccount.onBudget && account.onBudget) {
    return true;
  }

  if (investmentAccounts[transferAccountId]) {
    return true;
  }

  return false;
};

export const filterTransactions = ({ budget, investmentAccounts = {} }) =>
  reject(
    anyPass([
      transaction =>
        PAYEES_TO_EXCLUDE.includes(
          get([transaction.payeeId, "name"])(budget.payeesById)
        ),
      isTransfer({ accountsById: budget.accountsById, investmentAccounts }),
      transaction => !transaction.categoryId
    ])
  );

export const splitTransactions = ({
  categoryGroupsById,
  categoriesById,
  transactions
}) => {
  const incomeTransactions = transactions.filter(
    isIncome({ categoryGroupsById, categoriesById, transactions })
  );
  const expenseTransactions = difference(transactions, incomeTransactions);

  return { incomeTransactions, expenseTransactions };
};

export const getTransactionMonth = transaction => transaction.date.slice(0, 7);

export const getFirstMonth = budget =>
  getTransactionMonth(budget.transactions[budget.transactions.length - 1]);

export const getMonthsToNow = firstMonth => {
  const currentMonth = moment().format("YYYY-MM");
  const months = [firstMonth];
  let m = firstMonth;

  while (m !== currentMonth) {
    m = moment(m)
      .add(1, "months")
      .format("YYYY-MM");
    months.push(m);
  }

  return months;
};

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
