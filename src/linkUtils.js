export const getBudgetLink = ({ budgetId }) => `/budgets/${budgetId}`;

export const getCurrentMonthLink = ({ budgetId }) => `/budgets/${budgetId}`;

export const getCurrentMonthGroupLink = ({ budgetId, categoryGroupId }) =>
  `/budgets/${budgetId}/current/${categoryGroupId}`;

export const getCurrentMonthCategoryLink = ({
  budgetId,
  categoryGroupId,
  categoryId
}) => `/budgets/${budgetId}/current/${categoryGroupId}/${categoryId}`;

export const getCategoryGroupsLink = ({ budgetId }) =>
  `/budgets/${budgetId}/categories`;

export const getCategoryGroupLink = ({ budgetId, categoryGroupId }) =>
  `/budgets/${budgetId}/category-groups/${categoryGroupId}`;

export const getCategoryLink = ({ budgetId, categoryGroupId, categoryId }) =>
  `/budgets/${budgetId}/category-groups/${categoryGroupId}/${categoryId}`;

export const getPayeesLink = ({ budgetId }) => `/budgets/${budgetId}/payees`;

export const getPayeeLink = ({ budgetId, payeeId }) =>
  `/budgets/${budgetId}/payees/${payeeId}`;
