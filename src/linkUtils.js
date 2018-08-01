export const getBudgetLink = ({ budgetId }) => `/budgets/${budgetId}`;

export const getCurrentMonthGroupLink = ({ budgetId, categoryGroupId }) =>
  `/budgets/${budgetId}/current/category-groups/${categoryGroupId}`;

export const getCurrentMonthCategoryLink = ({ budgetId, categoryId }) =>
  `/budgets/${budgetId}/current/categories/${categoryId}`;

export const getCategoryLink = ({ budgetId, categoryId }) =>
  `/budgets/${budgetId}/categories/${categoryId}`;

export const getPayeeLink = ({ budgetId, payeeId }) =>
  `/budgets/${budgetId}/payees/${payeeId}`;
