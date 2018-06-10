import flatMap from "lodash/flatMap";
import flow from "lodash/flow";
import keyBy from "lodash/keyBy";
import omit from "lodash/omit";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import moment from "moment";
import { upsertBy } from "./utils";
import { formatCurrency, camelCaseKeys } from "./utils";

const GROUPS_TO_HIDE = [
  "Internal Master Category",
  "Credit Card Payments",
  "Hidden Categories"
];

export const sanitizeBudget = (
  budget,
  currentMonth = moment().format("YYYY-MM")
) => {
  const categoriesFromMonth = keyBy(
    budget.months.find(m => m.month === currentMonth + "-01").categories,
    "id"
  );
  const transactionIdsFromSub = uniq(
    budget.subtransactions.map(s => s.transaction_id)
  );
  const categoryGroups = budget.category_groups.filter(
    group => !GROUPS_TO_HIDE.includes(group.name)
  );
  const categories = budget.categories.map(c => {
    const mergedCategory = { ...c, ...categoriesFromMonth[c.id] };
    return camelCaseKeys({
      ...mergedCategory,
      activity: formatCurrency(mergedCategory.activity),
      balance: formatCurrency(mergedCategory.balance),
      budgeted: formatCurrency(mergedCategory.budgeted)
    });
  });
  const payees = camelCaseKeys(budget.payees);

  return {
    ...camelCaseKeys(
      omit(budget, [
        "categories",
        "category_groups",
        "payees",
        "months",
        "transactions"
      ])
    ),
    categoryGroups,
    categoryGroupsById: keyBy(categoryGroups, "id"),
    categories,
    categoriesById: keyBy(categories, "id"),
    payees,
    payeesById: keyBy(payees, "id"),
    months: sortBy(camelCaseKeys(budget.months), "month"),
    transactions: flow([
      transactions =>
        transactions.filter(
          transaction =>
            !transaction.transfer_account_id && transaction.amount !== 0
        ),
      transactions => sortBy(transactions, "date"),
      transactions => transactions.reverse(),
      transactions =>
        flatMap(
          transactions,
          transaction =>
            transactionIdsFromSub.includes(transaction.id)
              ? budget.subtransactions
                  .filter(sub => sub.transaction_id === transaction.id)
                  .map(sub =>
                    omit({ ...transaction, ...sub }, ["transaction_id"])
                  )
              : transaction
        ),
      transactions =>
        transactions.map(transaction => ({
          ...transaction,
          amount: formatCurrency(transaction.amount)
        })),
      camelCaseKeys
    ])(budget.transactions)
  };
};

const applyDeltas = (arr, deltas, key = "id", updater) =>
  deltas.reduce((acc, curr) => upsertBy(acc, key, curr, updater), arr);

const arraysToUpdate = [
  "accounts",
  "categories",
  "category_groups",
  "payee_locations",
  "payees",
  "scheduled_subtransactions",
  "scheduled_transactions",
  "subtransactions",
  "transactions"
];

export const mergeBudgets = (budget, deltas) => ({
  ...budget,
  ...deltas,
  ...arraysToUpdate.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: applyDeltas(budget[curr], deltas[curr])
    }),
    {}
  ),
  months: applyDeltas(budget.months, deltas.months, "month", (prev, curr) => ({
    ...prev,
    ...curr,
    categories: applyDeltas(prev.categories, curr.categories)
  }))
});
