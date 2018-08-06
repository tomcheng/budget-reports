const pages = {
  currentMonth: {
    path: "/budgets/:budgetId",
    title: "Current Month Spending",
    linkFunction: ({ budgetId }) => `/budgets/${budgetId}`
  },
  currentMonthGroup: {
    path: "/budgets/:budgetId/current/:categoryGroupId",
    title: (params, budget) =>
      budget.categoryGroupsById[params.categoryGroupId].name
  },
  currentMonthCategory: {
    path: "/budgets/:budgetId/current/:categoryGroupId/:categoryId",
    title: (params, budget) => budget.categoriesById[params.categoryId].name
  },
  categories: {
    path: "/budgets/:budgetId/categories",
    title: "Categories",
    linkFunction: ({ budgetId }) => `/budgets/${budgetId}/categories`
  },
  group: {
    path: "/budgets/:budgetId/category-groups/:categoryGroupId",
    title: (params, budget) =>
      budget.categoryGroupsById[params.categoryGroupId].name
  },
  category: {
    path: "/budgets/:budgetId/category-groups/:categoryGroupId/:categoryId",
    title: (params, budget) => budget.categoriesById[params.categoryId].name
  },
  payees: {
    path: "/budgets/:budgetId/payees",
    title: "Payees",
    linkFunction: ({ budgetId }) => `/budgets/${budgetId}/payees`
  },
  payee: {
    path: "/budgets/:budgetId/payees/:payeeId",
    title: (params, budget) => budget.payeesById[params.payeeId].name
  },
  incomeVsExpenses: {
    path: "/budgets/:budgetId/income-vs-expenses",
    title: "Income vs Expenses",
    linkFunction: ({ budgetId }) => `/budgets/${budgetId}/income-vs-expenses`
  },
  netWorth: {
    path: "/budgets/:budgetId/net-worth",
    title: "Net Worth",
    linkFunction: ({ budgetId }) => `/budgets/${budgetId}/net-worth`
  },
  projections: {
    path: "/budgets/:budgetId/projections",
    title: "Retirement Calculator",
    linkFunction: ({ budgetId }) => `/budgets/${budgetId}/projections`
  }
};

export default pages;
