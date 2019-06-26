import compose from "lodash/fp/compose";
import pick from "lodash/fp/pick";
import mapRaw from "lodash/fp/map";
import get from "lodash/fp/get";
import last from "lodash/fp/last";
import { groupByProp, simpleMemoize, sumByProp } from "./dataUtils";

const map = mapRaw.convert({ cap: false });

export const isStartingBalanceOrReconciliation = simpleMemoize(budget => {
  const startingBalancePayeeId = get("id")(
    budget.payees.find(payee => payee.name === "Starting Balance")
  );
  const reconciliationPayeeId = get("id")(
    budget.payees.find(
      payee => payee.name === "Reconciliation Balance Adjustment"
    )
  );

  return transaction =>
    transaction.payee_id === startingBalancePayeeId ||
    transaction.payee_id === reconciliationPayeeId;
});

export const isIncome = simpleMemoize(budget => {
  const toBeBudgetedId = get("id")(
    budget.categories.find(category => category.name === "To be Budgeted")
  );
  return transaction => transaction.category_id === toBeBudgetedId;
});

export const isTransfer = (investmentAccounts = {}) => transaction =>
  !transaction.category_id ||
  !!investmentAccounts[transaction.transfer_account_id];

export const getTransactionMonth = transaction => transaction.date.slice(0, 7);

const rejectNonCategoryTransations = simpleMemoize(transactions =>
  transactions.filter(tran => !!tran.category_id)
);

export const getFirstMonth = budget => {
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
      amount: sumByProp("amount")(transactions) / divideBy
    })),
    groupByProp("payee_id")
  ])(transactions);

export const sanitizeName = name => name.replace(/[^a-zA-Z0-9 ]/g, "").trim();
