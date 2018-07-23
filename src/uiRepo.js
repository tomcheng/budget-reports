import { getStorage, setStorage } from "./utils";
import get from "lodash/get";

export const EXPANDED_GROUPS = "expandedGroups";
export const INVESTMENT_ACCOUNTS = "investmentAccounts";
export const LAST_UPDATED = "lastUpdated";
export const MORTGAGE_ACCOUNTS = "mortgageAccounts";
export const NET_WORTH_HIDDEN_ACCOUNTS = "netWorthHiddenAccounts";
export const PAYEES_SORT_ORDER = "payeesSortOrder";
export const SPENDING_MONTHS_TO_COMPARE = "spendingMonthsToCompare";

const SETTINGS = {
  [EXPANDED_GROUPS]: {
    key: "budget-reports-expanded-groups",
    default: {}
  },
  [INVESTMENT_ACCOUNTS]: {
    key: "budget-reports-investment-accounts",
    default: {}
  },
  [LAST_UPDATED]: {
    key: "budget-reports-last-updated",
    default: null
  },
  [MORTGAGE_ACCOUNTS]: {
    key: "budget-reports-mortgage-accounts",
    default: {}
  },
  [NET_WORTH_HIDDEN_ACCOUNTS]: {
    key: "budget-reports-networth-hidden-accounts",
    default: {}
  },
  [PAYEES_SORT_ORDER]: {
    key: "budget-reports-payees-sort-order",
    default: "amount"
  },
  [SPENDING_MONTHS_TO_COMPARE]: {
    key: "budget-reports-spending-months-to-compare",
    default: 3
  }
};

export const getSetting = (setting, budgetId) =>
  get(getStorage(SETTINGS[setting].key), budgetId, SETTINGS[setting].default);

export const setSetting = (setting, budgetId, value) => {
  const previousSetting = getStorage(SETTINGS[setting].key);
  setStorage(SETTINGS[setting].key, {
    ...previousSetting,
    [budgetId]: value
  });
};
