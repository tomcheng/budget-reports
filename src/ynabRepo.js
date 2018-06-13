import * as ynab from "ynab";
import get from "lodash/fp/get";
import matches from "lodash/fp/matches";
import { camelCaseKeys, getStorage, setStorage } from "./utils";
import { setLastUpdated } from "./uiRepo";
import { sanitizeBudget, mergeBudgets } from "./repoUtils";
import { clientId, redirectUri } from "./ynabConfig";

const TOKEN_STORAGE_KEY = "ynab_access_token";
const BUDGETS_STORAGE_KEY = "ynab_budgets";
const BUDGET_DETAILS_STORAGE_KEY = "ynab_budget_details";

export const AUTHORIZE_URL =
  "https://app.youneedabudget.com/oauth/authorize?client_id=" +
  clientId +
  "&redirect_uri=" +
  redirectUri +
  "&response_type=token";

export const getAuthorizeToken = () => {
  // check for hash route
  if (window.location.hash[1] === "/") {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  const search = window.location.hash
    .substring(1)
    .replace(/&/g, '","')
    .replace(/=/g, '":"');

  if (!search) {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  const token = get("access_token")(
    JSON.parse(
      '{"' + search + '"}',
      (key, value) => (key === "" ? value : decodeURIComponent(value))
    )
  );
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.location.hash = "";

  return token;
};

let api = null;

export const initializeYnabApi = token => {
  api = new ynab.api(token);
};

export const getBudgets = () => {
  const cachedBudgets = getStorage(BUDGETS_STORAGE_KEY);

  if (cachedBudgets) {
    return Promise.resolve(camelCaseKeys(cachedBudgets));
  } else {
    return api.budgets.getBudgets().then(({ data }) => {
      setStorage(BUDGETS_STORAGE_KEY, data);
      return camelCaseKeys(data);
    });
  }
};

const getBudget = budgetId =>
  api.budgets.getBudgetById(budgetId).then(({ data }) => {
    const allBudgets = getStorage(BUDGET_DETAILS_STORAGE_KEY);
    setStorage(
      BUDGET_DETAILS_STORAGE_KEY,
      budgetId ? { ...allBudgets, [budgetId]: data } : data
    );
    setLastUpdated(budgetId);

    return { budget: sanitizeBudget(data.budget), authorized: true };
  });

export const getUpdatedBudget = id => {
  const details = getStorage(BUDGET_DETAILS_STORAGE_KEY);
  const budgetDetails = get(id)(details);

  if (!budgetDetails) {
    return getBudget(id);
  }

  const serverKnowledge = budgetDetails.server_knowledge;

  return api.budgets
    .getBudgetById(id, serverKnowledge)
    .then(({ data }) => {
      const newDetails = {
        ...details,
        [id]: {
          budget: mergeBudgets(details[id].budget, data.budget),
          server_knowledge: data.server_knowledge
        }
      };
      setStorage(BUDGET_DETAILS_STORAGE_KEY, newDetails);
      setLastUpdated(id);

      return {
        budget: sanitizeBudget(newDetails[id].budget),
        authorized: true
      };
    })
    .catch(({ error }) => {
      if (matches({ id: "401", name: "unauthorized" })(error)) {
        const cached = get(id)(getStorage(BUDGET_DETAILS_STORAGE_KEY));
        return {
          budget: cached ? sanitizeBudget(cached.budget) : null,
          authorized: false
        };
      }
    });
};
