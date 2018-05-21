import { getStorage, setStorage } from "./utils";
import get from "lodash/get";

const EXPANDED_GROUPS_KEY = "budget-reports-expanded-groups";

export const getExpandedGroups = budgetId =>
  get(getStorage(EXPANDED_GROUPS_KEY), budgetId, {});

export const setExpandedGroups = (budgetId, expanded) => {
  const expandedGroups = getStorage(EXPANDED_GROUPS_KEY) || {};
  setStorage(EXPANDED_GROUPS_KEY, { ...expandedGroups, [budgetId]: expanded });
};
