import compose from "lodash/fp/compose";
import flatMap from "lodash/fp/flatMap";
import filter from "lodash/fp/filter";
import keyBy from "lodash/fp/keyBy";
import omit from "lodash/fp/omit";
import map from "lodash/fp/map";
import reverse from "lodash/fp/reverse";
import sortBy from "lodash/fp/sortBy";
import uniq from "lodash/fp/uniq";
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
  const categoriesFromMonth = keyBy("id")(
    budget.months.find(m => m.month === currentMonth + "-01").categories
  );
  const transactionIdsFromSub = uniq(
    map("transaction_id")(budget.subtransactions)
  );
  const categoryGroups = filter(group => !GROUPS_TO_HIDE.includes(group.name))(
    budget.category_groups
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
      omit([
        "categories",
        "category_groups",
        "payees",
        "months",
        "transactions"
      ])(budget)
    ),
    categoryGroups,
    categoryGroupsById: keyBy("id")(categoryGroups),
    categories,
    categoriesById: keyBy("id")(categories),
    payees,
    payeesById: keyBy("id")(payees),
    months: sortBy("month")(camelCaseKeys(budget.months)),
    transactions: compose([
      camelCaseKeys,
      map(transaction => ({
        ...transaction,
        amount: formatCurrency(transaction.amount)
      })),
      flatMap(
        transaction =>
          transactionIdsFromSub.includes(transaction.id)
            ? compose([
                map(sub => omit("transaction_id")({ ...transaction, ...sub })),
                filter(sub => sub.transaction_id === transaction.id)
              ])(budget.subtransactions)
            : transaction
      ),
      reverse,
      sortBy("date"),
      filter(
        transaction =>
          !transaction.transfer_account_id && transaction.amount !== 0
      )
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
