import get from "lodash/get";
import { getBigStorage, setBigStorage } from "./localstorageUtils";

const BUDGET_DETAILS_STORAGE_KEY = "ynab_budget_details";

let cachedDetails = null;

const getAllBudgetDetails = async () => {
  if (cachedDetails) {
    return cachedDetails;
  }
  cachedDetails = await getBigStorage(BUDGET_DETAILS_STORAGE_KEY);
  return cachedDetails;
};

export const getBudgetDetails = async (id) => {
  const allDetails = await getAllBudgetDetails();
  return get(allDetails, id);
};

export const setBudgetDetails = async ({ id, budget, server_knowledge }) => {
  const details = await getAllBudgetDetails();
  const newDetails = {
    ...details,
    [id]: { budget, server_knowledge },
  };
  setBigStorage(BUDGET_DETAILS_STORAGE_KEY, newDetails);
  cachedDetails = newDetails;
};
