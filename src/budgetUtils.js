import { simpleMemoize } from "./optimized";

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
