import get from "lodash/get";
import { camelCaseKeys, getStorage, setStorage, upsertBy } from "./utils";
import { formatCurrency } from "./utils";
import keyBy from "lodash/keyBy";

export const makeCachedCall = ({
  apiCall,
  storageKey,
  onFailure,
  formatter = a => a
}) => param => {
  const cachedAll = getStorage(storageKey);
  const cached = param ? get(cachedAll, param) : cachedAll;

  if (cached) {
    return Promise.resolve(formatter(camelCaseKeys(cached)));
  } else {
    return apiCall(param)
      .then(({ data }) => {
        setStorage(storageKey, param ? { ...cachedAll, [param]: data } : data);
        return formatter(camelCaseKeys(data));
      })
      .catch(onFailure);
  }
};

export const sanitizeBudget = budget => ({
  ...budget,
  categories: budget.categories.map(c => ({
    ...c,
    activity: formatCurrency(c.activity),
    balance: formatCurrency(c.balance),
    budgeted: formatCurrency(c.budgeted)
  })),
  payees: keyBy(budget.payees, "id"),
  transactions: budget.transactions.map(t => ({
    ...t,
    amount: formatCurrency(t.amount)
  }))
});

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
