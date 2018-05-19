import { api as YnabApi } from "ynab";
import { makeCachedCall } from "./repoUtils";

let api = null;
const TOKEN_STORAGE_KEY = "ynab_access_token";

export let getBudgets = null;
export let getCategories = null;

export const getAuthorizeToken = () => {
  let token = null;
  const search = window.location.hash
    .substring(1)
    .replace(/&/g, '","')
    .replace(/=/g, '":"');

  if (search && search !== "") {
    const params = JSON.parse(
      '{"' + search + '"}',
      (key, value) => (key === "" ? value : decodeURIComponent(value))
    );
    token = params["access_token"];
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    window.location.hash = "";
  } else {
    token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  }

  return token;
};

const handleFailure = () => {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  window.location.reload();
};

export const initializeYnabApi = token => {
  api = new YnabApi(token);
  getBudgets = makeCachedCall({
    apiCall: api.budgets.getBudgets.bind(api.budgets),
    storageKey: "ynab_budgets",
    onFailure: handleFailure
  });
  getCategories = makeCachedCall({
    apiCall: api.categories.getCategories.bind(api.categories),
    storageKey: "ynab_categories",
    onFailure: handleFailure,
    updater: ({ params, cached, data }) => ({
      ...cached,
      [params]: data
    })
  });
};
