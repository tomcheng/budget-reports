import compose from "lodash/fp/compose";
import find from "lodash/fp/find";
import pick from "lodash/fp/pick";
import mapRaw from "lodash/fp/map";
import last from "lodash/fp/last";
import { groupByProp, simpleMemoize, sumByProp } from "./dataUtils";

const map = mapRaw.convert({ cap: false });

export const isStartingBalanceOrReconciliation = simpleMemoize((budget) => {
  const startingBalancePayee = find({ name: "Starting Balance" })(
    budget.payees
  );
  const reconciliationPayee = find({
    name: "Reconciliation Balance Adjustment",
  })(budget.payees);

  return (transaction) =>
    transaction.payee_id === startingBalancePayee?.id ||
    transaction.payee_id === reconciliationPayee?.id;
});

export const isIncome = simpleMemoize((budget) => {
  const toBeBudgeted = find((category) => category.name.match(/^Inflow: /))(
    budget.categories
  );
  return (transaction) => transaction.category_id === toBeBudgeted?.id;
});

export const isTransfer =
  (investmentAccounts = {}) =>
  (transaction) =>
    !transaction.category_id ||
    Boolean(investmentAccounts[transaction.transfer_account_id]);

export const getTransactionMonth = (transaction) =>
  transaction.date.slice(0, 7);

const rejectNonCategoryTransations = simpleMemoize((transactions) =>
  transactions.filter((tran) => tran.category_id)
);

export const getFirstMonth = (budget) => {
  const filteredTransactions = rejectNonCategoryTransations(
    budget.transactions
  );

  return filteredTransactions.length
    ? getTransactionMonth(last(filteredTransactions))
    : undefined;
};

export const getPayeeNodes = ({ payeesById, transactions }, divideBy = 1) =>
  compose([
    map((transactions, payeeId) => ({
      ...(payeesById[payeeId]
        ? pick(["id", "name"])(payeesById[payeeId])
        : { id: "no-payee", name: "(no payee)" }),
      amount: sumByProp("amount")(transactions) / divideBy,
    })),
    groupByProp("payee_id"),
  ])(transactions);

export const sanitizeName = (name) => name.replace(/[^a-zA-Z0-9 ]/g, "").trim();
