export const makeLink = (path, params) =>
  path.replace(/:([a-zA-Z]*)/g, (_, part) => params[part]);

const pages = {
  currentMonth: {
    path: "/budgets/:budgetId/current",
    title: "Current Month Spending",
    props: ["budget", "currentMonth", "investmentAccounts"]
  },
  currentMonthGroup: {
    path: "/budgets/:budgetId/current/:categoryGroupId",
    title: (params, budget) =>
      budget.categoryGroupsById[params.categoryGroupId].name,
    props: ["budget", "currentMonth"],
    paramProps: ["categoryGroupId"],
    breadcrumbs: ["currentMonth"]
  },
  currentMonthCategory: {
    path: "/budgets/:budgetId/current/:categoryGroupId/:categoryId",
    title: (params, budget) => budget.categoriesById[params.categoryId].name,
    props: ["budget", "currentMonth"],
    paramProps: ["categoryId", "categoryGroupId"],
    breadcrumbs: ["currentMonth", "currentMonthGroup"]
  },
  groups: {
    path: "/budgets/:budgetId/groups",
    title: "Spending Trends",
    props: ["budget"]
  },
  group: {
    path: "/budgets/:budgetId/groups/:categoryGroupId",
    title: (params, budget) =>
      budget.categoryGroupsById[params.categoryGroupId].name,
    props: ["budget"],
    paramProps: ["categoryGroupId"],
    breadcrumbs: ["groups"]
  },
  category: {
    path: "/budgets/:budgetId/groups/:categoryGroupId/categories/:categoryId",
    title: (params, budget) => budget.categoriesById[params.categoryId].name,
    props: ["budget"],
    paramProps: ["categoryId"],
    breadcrumbs: ["groups", "group"]
  },
  categoryPayee: {
    path:
      "/budgets/:budgetId/groups/:categoryGroupId/categories/:categoryId/payees/:payeeId",
    title: (params, budget) => budget.payeesById[params.payeeId].name,
    props: ["budget"],
    paramProps: ["categoryId", "payeeId"],
    breadcrumbs: ["groups", "group", "category"]
  },
  income: {
    path: "/budgets/:budgetId/income",
    title: "Income Trends",
    props: ["budget"]
  },
  incomeVsExpenses: {
    path: "/budgets/:budgetId/income-vs-expenses",
    title: "Income vs Expenses",
    props: ["budget", "investmentAccounts"]
  },
  netWorth: {
    path: "/budgets/:budgetId/net-worth",
    title: "Net Worth",
    props: ["budget", "investmentAccounts", "mortgageAccounts"]
  },
  investments: {
    path: "/budgets/:budgetId/investments",
    title: "Investments",
    props: ["budget", "investmentAccounts"]
  },
  projections: {
    path: "/budgets/:budgetId/projections",
    title: "Retirement Calculator",
    props: ["budget", "investmentAccounts", "mortgageAccounts"]
  },
  settings: {
    path: "/budgets/:budgetId/settings",
    title: "Budget Settings",
    props: [
      "budget",
      "investmentAccounts",
      "mortgageAccounts",
      "onUpdateAccounts"
    ]
  }
};

export default pages;
