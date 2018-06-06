import flatMap from "lodash/flatMap";
import keyBy from "lodash/keyBy";
import omit from "lodash/omit";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import moment from "moment";
import { upsertBy } from "./utils";
import { formatCurrency, camelCaseKeys } from "./utils";

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

  return {
    ...camelCaseKeys(
      omit(budget, ["categories", "payees", "months", "transactions"])
    ),
    categories: budget.categories.map(c => {
      const mergedCategory = { ...c, ...categoriesFromMonth[c.id] };
      return camelCaseKeys({
        ...mergedCategory,
        activity: formatCurrency(mergedCategory.activity),
        balance: formatCurrency(mergedCategory.balance),
        budgeted: formatCurrency(mergedCategory.budgeted)
      });
    }),
    payees: keyBy(camelCaseKeys(budget.payees), "id"),
    months: sortBy(camelCaseKeys(budget.months), "month"),
    transactions: camelCaseKeys(
      flatMap(
        sortBy(budget.transactions, "date").reverse(),
        t =>
          transactionIdsFromSub.includes(t.id)
            ? budget.subtransactions
                .filter(s => s.transaction_id === t.id)
                .map(s =>
                  omit({ ...t, ...s, amount: formatCurrency(s.amount) }, [
                    "transaction_id"
                  ])
                )
            : {
                ...t,
                amount: formatCurrency(t.amount)
              }
      )
    )
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
