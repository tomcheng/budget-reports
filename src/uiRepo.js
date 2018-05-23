import { getStorage, setStorage } from "./utils";
import get from "lodash/get";
import moment from "moment";

const EXPANDED_GROUPS_KEY = "budget-reports-expanded-groups";
const LAST_UPDATED_KEY = "budget-reports-last-updated";

export const getExpandedGroups = budgetId =>
  get(getStorage(EXPANDED_GROUPS_KEY), budgetId, {});

export const setExpandedGroups = (budgetId, expanded) => {
  const expandedGroups = getStorage(EXPANDED_GROUPS_KEY) || {};
  setStorage(EXPANDED_GROUPS_KEY, { ...expandedGroups, [budgetId]: expanded });
};

export const setLastUpdated = budgetId => {
  const lastUpdated = getStorage(LAST_UPDATED_KEY) || {};
  setStorage(LAST_UPDATED_KEY, {
    ...lastUpdated,
    [budgetId]: moment().valueOf()
  });
};

export const getLastUpdated = budgetId =>
  get(getStorage(LAST_UPDATED_KEY), budgetId, null);
