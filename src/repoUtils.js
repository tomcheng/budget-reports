import moment from "moment";
import anyPass from "lodash/fp/anyPass";
import compose from "lodash/fp/compose";
import flatMap from "lodash/fp/flatMap";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import get from "lodash/fp/get";
import keyBy from "lodash/fp/keyBy";
import map from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import omit from "lodash/fp/omit";
import prop from "lodash/fp/prop";
import reject from "lodash/fp/reject";
import reverse from "lodash/fp/reverse";
import sortBy from "lodash/fp/sortBy";
import uniq from "lodash/fp/uniq";
import { upsertBy } from "./utils";
import { formatCurrency, camelCaseKeys } from "./utils";

const GROUPS_TO_HIDE = [
  "Internal Master Category",
  "Credit Card Payments",
  "Hidden Categories"
];
const PAYEES_TO_EXCLUDE = [
  "Starting Balance",
  "Reconciliation Balance Adjustment"
];

export const sanitizeBudget = (
  budget,
  currentMonth = moment().format("YYYY-MM")
) => {
  const categoriesFromMonth = compose([
    keyBy("id"),
    get("categories"),
    find(matchesProperty("month", currentMonth + "-01"))
  ])(budget.months);
  const transactionIdsFromSub = uniq(
    map("transaction_id")(budget.subtransactions)
  );
  const categoryGroups = reject(group => GROUPS_TO_HIDE.includes(group.name))(
    budget.category_groups
  );
  const categories = map(c => {
    const mergedCategory = { ...c, ...categoriesFromMonth[c.id] };
    return camelCaseKeys({
      ...mergedCategory,
      activity: formatCurrency(mergedCategory.activity),
      balance: formatCurrency(mergedCategory.balance),
      budgeted: formatCurrency(mergedCategory.budgeted)
    });
  })(budget.categories);
  const payees = compose([
    camelCaseKeys,
    reject(payee => PAYEES_TO_EXCLUDE.includes(payee.name))
  ])(budget.payees);
  const payeesById = keyBy("id")(payees);

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
    payeesById,
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
                filter(matchesProperty("transaction_id", transaction.id))
              ])(budget.subtransactions)
            : transaction
      ),
      reverse,
      sortBy("date"),
      reject(
        anyPass([
          prop("transfer_account_id"),
          matchesProperty("amount", 0),
          transaction => !payeesById[transaction.payee_id]
        ])
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
