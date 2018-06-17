import get from "lodash/fp/get";
import { getStorage, setStorage } from "./utils";

const BUDGET_DETAILS_STORAGE_KEY = "ynab_budget_details";

let cachedDetails = null;

const getAllBudgetDetails = () => {
  if (cachedDetails) {
    return cachedDetails;
  }
  cachedDetails = getStorage(BUDGET_DETAILS_STORAGE_KEY);
  return cachedDetails;
};

export const getBudgetDetails = id => get(id)(getAllBudgetDetails());

export const setBudgetDetails = ({ id, budget, server_knowledge }) => {
  const details = getAllBudgetDetails();
  const newDetails = {
    ...details,
    [id]: { budget, server_knowledge }
  };
  setStorage(BUDGET_DETAILS_STORAGE_KEY, newDetails);
  cachedDetails = newDetails;
};
