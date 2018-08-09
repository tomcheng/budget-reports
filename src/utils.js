import { utils } from "ynab";
import moment from "moment";
import { groupBy, groupByProp, sumBy, sumByProp } from "./optimized";
import compose from "lodash/fp/compose";
import curry from "lodash/fp/curry";
import filter from "lodash/fp/filter";
import isArray from "lodash/fp/isArray";
import isObject from "lodash/fp/isObject";
import mapRaw from "lodash/fp/map";
import mapKeysRaw from "lodash/fp/mapKeys";
import mapValues from "lodash/fp/mapValues";
import mean from "lodash/fp/mean";
import pick from "lodash/fp/pick";
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
    groupByProp("payee_id")
  ])(transactions);

const isIncome = ({
  categoryGroupsById,
  categoriesById,
  transactions
}) => transaction => {
  const { category_id: categoryId, payee_id: payeeId } = transaction;

  if (
    categoryId &&
    categoryGroupsById[categoriesById[categoryId].category_group_id]
  ) {
    return false;
  }

  return (
    compose([
      sumByProp("amount"),
      transactions =>
        transactions.filter(transaction => transaction.payee_id === payeeId)
    ])(transactions) > 0
  );
};

const isTransfer = ({ accountsById, investmentAccounts, transaction }) => {
  const {
    account_id: accountId,
    transfer_account_id: transferAccountId
  } = transaction;
  const account = accountsById[accountId];

  if (!account.on_budget) {
    return true;
  }

  if (!transferAccountId) {
    return false;
  }

  const transferAccount = accountsById[transferAccountId];

  if (transferAccount.on_budget && account.on_budget) {
    return true;
  }

  if (investmentAccounts[transferAccountId]) {
    return true;
  }

  return false;
};

export const filterTransactions = ({
  budget,
  investmentAccounts = {}
}) => transactions =>
  transactions.filter(transaction => {
    if (
      PAYEES_TO_EXCLUDE.includes(
        get([transaction.payee_id, "name"])(budget.payeesById)
      )
    ) {
      return false;
    }
    if (
      isTransfer({
        accountsById: budget.accountsById,
        investmentAccounts,
        transaction
      })
    ) {
      return false;
    }
    if (!transaction.category_id) {
      return false;
    }
    return true;
  });

export const splitTransactions = ({
  categoryGroupsById,
  categoriesById,
  transactions
}) => {
  const grouped = groupBy(
    isIncome({ categoryGroupsById, categoriesById, transactions })
  )(transactions);

  return {
    incomeTransactions: grouped.true || [],
    expenseTransactions: grouped.false || []
  };
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
