const pages = {
  currentMonth: {
    path: "/budgets/:budgetId",
    title: "Current Month Spending",
    linkFunction: ({ budgetId }) => `/budgets/${budgetId}`
  },
  categories: {
    path: "/budgets/:budgetId/categories",
    title: "Categories",
    linkFunction: ({ budgetId }) => `/budgets/${budgetId}/categories`
  },
  payees: {
    path: "/budgets/:budgetId/payees",
    title: "Payees",
    linkFunction: ({ budgetId }) => `/budgets/${budgetId}/payees`
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
