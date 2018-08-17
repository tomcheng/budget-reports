import { utils } from "ynab";
import moment from "moment";
import compose from "lodash/fp/compose";
import flatMap from "lodash/fp/flatMap";
import filter from "lodash/fp/filter";
import dropWhile from "lodash/fp/dropWhile";
import keyBy from "lodash/fp/keyBy";
import map from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import omit from "lodash/fp/omit";
import reject from "lodash/fp/reject";
import reverse from "lodash/fp/reverse";
import sortBy from "lodash/fp/sortBy";
import uniq from "lodash/fp/uniq";
import { upsertBy } from "./dataUtils";

const formatCurrency = utils.convertMilliUnitsToCurrencyAmount;

const GROUPS_TO_HIDE = [
  "Internal Master Category",
  "Credit Card Payments",
  "Hidden Categories"
];

const MAX_MONTHS_TO_SHOW = 24;

export const sanitizeBudget = budget => {
  const transactionIdsFromSub = uniq(
    map("transaction_id")(budget.subtransactions)
  );
  const categoryGroups = reject(group => GROUPS_TO_HIDE.includes(group.name))(
    budget.category_groups
  );
  const categories = map(category => ({
    ...category,
    activity: formatCurrency(category.activity),
    balance: formatCurrency(category.balance),
    budgeted: formatCurrency(category.budgeted)
  }))(budget.categories);
  const earliestDate = moment()
    .subtract(MAX_MONTHS_TO_SHOW - 1, "months")
    .format("YYYY-MM-01");

  return {
    ...omit(["categories", "category_groups", "months", "transactions"])(
      budget
    ),
    accountsById: keyBy("id")(budget.accounts),
    categoryGroups,
    categoryGroupsById: keyBy("id")(categoryGroups),
    categories,
    categoriesById: keyBy("id")(categories),
    payeesById: keyBy("id")(budget.payees),
    months: sortBy("month")(budget.months),
    transactions: compose([
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
      dropWhile(transaction => transaction.date < earliestDate),
      sortBy("date"),
      transactions =>
        transactions.filter(transaction => transaction.amount !== 0)
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
