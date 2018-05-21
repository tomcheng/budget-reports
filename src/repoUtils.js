import get from "lodash/get";
import { camelCaseKeys, getStorage, setStorage } from "./utils";
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
