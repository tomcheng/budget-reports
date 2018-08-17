import moment from "moment";
import compose from "lodash/fp/compose";
import pick from "lodash/fp/pick";
import mapRaw from "lodash/fp/map";
import { groupByProp, simpleMemoize, sumByProp } from "./dataUtils";

const map = mapRaw.convert({ cap: false });

export const isStartingBalanceOrReconciliation = simpleMemoize(budget => {
  const startingBalancePayeeId = budget.payees.find(
    payee => payee.name === "Starting Balance"
  ).id;
  const reconciliationPayeeId = budget.payees.find(
    payee => payee.name === "Reconciliation Balance Adjustment"
  ).id;

  return transaction =>
    transaction.payee_id === startingBalancePayeeId ||
    transaction.payee_id === reconciliationPayeeId;
});

export const isIncome = simpleMemoize(budget => {
  const toBeBudgetedId = budget.categories.find(
    category => category.name === "To be Budgeted"
  ).id;
  return transaction => transaction.category_id === toBeBudgetedId;
});

export const isTransfer = (investmentAccounts = {}) => transaction =>
  !transaction.category_id ||
  !!investmentAccounts[transaction.transfer_account_id];

export const getTransactionMonth = transaction => transaction.date.slice(0, 7);

export const getFirstMonth = budget =>
  getTransactionMonth(budget.transactions[budget.transactions.length - 1]);

export const getNumMonths = budget => {
  const firstMonth = moment(getFirstMonth(budget));
  const current = moment();
  return current.diff(firstMonth, "months") + 1;
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

export const sanitizeName = name => name.replace(/[^a-zA-Z0-9 ]/g, "").trim();
