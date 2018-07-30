export const getBudgetLink = ({ budgetId }) => `/budgets/${budgetId}`;

export const getGroupLink = ({ budgetId, categoryGroupId }) =>
  `/budgets/${budgetId}/category-groups/${categoryGroupId}`;

export const getCategoryLink = ({ budgetId, categoryId }) =>
  `/budgets/${budgetId}/categories/${categoryId}`;

export const getPayeeLink = ({ budgetId, payeeId }) =>
  `/budgets/${budgetId}/payees/${payeeId}`;
