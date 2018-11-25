import CurrentMonth from "./components/CurrentMonth";
import CurrentMonthGroup from "./components/CurrentMonthGroup";
import CurrentMonthCategory from "./components/CurrentMonthCategory";
import Groups from "./components/Groups";
import Group from "./components/Group";
import Category from "./components/Category";
import CategoryPayee from "./components/CategoryPayee";
import Income from "./components/Income";
import IncomeVsExpenses from "./components/IncomeVsExpenses";
import NetWorth from "./components/NetWorth";
import Investments from "./components/Investments";
import Projections from "./components/Projections";
import Settings from "./components/Settings";

export const makeLink = (path, params) =>
  path.replace(/:([a-zA-Z]*)/g, (_, part) => params[part]);

const pages = {
  currentMonth: {
    path: "/budgets/:budgetId/current",
    title: "Current Month Spending",
    Component: CurrentMonth,
    props: ["budget", "currentMonth", "investmentAccounts"]
  },
  currentMonthGroup: {
    path: "/budgets/:budgetId/current/:categoryGroupId",
    title: (params, budget) =>
      budget.categoryGroupsById[params.categoryGroupId].name,
    Component: CurrentMonthGroup,
    props: ["budget", "currentMonth"],
    paramProps: ["categoryGroupId"],
    breadcrumbs: ["currentMonth"]
  },
  currentMonthCategory: {
    path: "/budgets/:budgetId/current/:categoryGroupId/:categoryId",
    title: (params, budget) => budget.categoriesById[params.categoryId].name,
    Component: CurrentMonthCategory,
    props: ["budget", "currentMonth"],
    paramProps: ["categoryId", "categoryGroupId"],
    breadcrumbs: ["currentMonth", "currentMonthGroup"]
  },
  groups: {
    path: "/budgets/:budgetId/groups",
    title: "Spending Trends",
    Component: Groups,
    props: ["budget"]
  },
  group: {
    path: "/budgets/:budgetId/groups/:categoryGroupId",
    title: (params, budget) =>
      budget.categoryGroupsById[params.categoryGroupId].name,
    Component: Group,
    props: ["budget"],
    paramProps: ["categoryGroupId"],
    breadcrumbs: ["groups"]
  },
  category: {
    path: "/budgets/:budgetId/groups/:categoryGroupId/categories/:categoryId",
    title: (params, budget) => budget.categoriesById[params.categoryId].name,
    Component: Category,
    props: ["budget"],
    paramProps: ["categoryId"],
    breadcrumbs: ["groups", "group"]
  },
  categoryPayee: {
    path:
      "/budgets/:budgetId/groups/:categoryGroupId/categories/:categoryId/payees/:payeeId",
    title: (params, budget) => budget.payeesById[params.payeeId].name,
    Component: CategoryPayee,
    props: ["budget"],
    paramProps: ["categoryId", "payeeId"],
    breadcrumbs: ["groups", "group", "category"]
  },
  income: {
    path: "/budgets/:budgetId/income",
    title: "Income Trends",
    Component: Income,
    props: ["budget"]
  },
  incomeVsExpenses: {
    path: "/budgets/:budgetId/income-vs-expenses",
    title: "Income vs Expenses",
    Component: IncomeVsExpenses,
    props: ["budget", "investmentAccounts"]
  },
  netWorth: {
    path: "/budgets/:budgetId/net-worth",
    title: "Net Worth",
    Component: NetWorth,
    props: ["budget", "investmentAccounts", "mortgageAccounts"]
  },
  investments: {
    path: "/budgets/:budgetId/investments",
    title: "Investments",
    Component: Investments,
    props: ["budget", "investmentAccounts"]
  },
  projections: {
    path: "/budgets/:budgetId/projections",
    title: "Retirement Calculator",
    Component: Projections,
    props: ["budget", "investmentAccounts", "mortgageAccounts"]
  },
  settings: {
    path: "/budgets/:budgetId/settings",
    title: "Budget Settings",
    Component: Settings,
    props: [
      "budget",
      "investmentAccounts",
      "mortgageAccounts",
      "onUpdateAccounts"
    ]
  }
};

export default pages;
