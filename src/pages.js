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
    props: props => ({
      budget: props.budget,
      currentMonth: props.currentMonth,
      investmentAccounts: props.investmentAccounts
    })
  },
  currentMonthGroup: {
    path: "/budgets/:budgetId/current/:categoryGroupId",
    title: (params, budget) =>
      budget.categoryGroupsById[params.categoryGroupId].name,
    Component: CurrentMonthGroup,
    props: (props, params) => ({
      budget: props.budget,
      categoryGroupId: params.categoryGroupId,
      currentMonth: props.currentMonth
    }),
    breadcrumbs: ["currentMonth"]
  },
  currentMonthCategory: {
    path: "/budgets/:budgetId/current/:categoryGroupId/:categoryId",
    title: (params, budget) => budget.categoriesById[params.categoryId].name,
    Component: CurrentMonthCategory,
    props: (props, params) => ({
      budget: props.budget,
      categoryId: params.categoryId,
      categoryGroupId: params.categoryGroupId,
      currentMonth: props.currentMonth
    }),
    breadcrumbs: ["currentMonth", "currentMonthGroup"]
  },
  groups: {
    path: "/budgets/:budgetId/groups",
    title: "Spending Trends",
    Component: Groups,
    props: props => ({ budget: props.budget })
  },
  group: {
    path: "/budgets/:budgetId/groups/:categoryGroupId",
    title: (params, budget) =>
      budget.categoryGroupsById[params.categoryGroupId].name,
    Component: Group,
    props: (props, params) => ({
      budget: props.budget,
      categoryGroup: props.budget.categoryGroupsById[params.categoryGroupId]
    }),
    breadcrumbs: ["groups"]
  },
  category: {
    path: "/budgets/:budgetId/groups/:categoryGroupId/categories/:categoryId",
    title: (params, budget) => budget.categoriesById[params.categoryId].name,
    Component: Category,
    props: (props, params) => ({
      budget: props.budget,
      category: props.budget.categoriesById[params.categoryId]
    }),
    breadcrumbs: ["groups", "group"]
  },
  categoryPayee: {
    path:
      "/budgets/:budgetId/groups/:categoryGroupId/categories/:categoryId/payees/:payeeId",
    title: (params, budget) => budget.payeesById[params.payeeId].name,
    Component: CategoryPayee,
    props: (props, params) => ({
      budget: props.budget,
      category: props.budget.categoriesById[params.categoryId],
      payee: props.budget.payeesById[params.payeeId]
    }),
    breadcrumbs: ["groups", "group", "category"]
  },
  income: {
    path: "/budgets/:budgetId/income",
    title: "Income Trends",
    Component: Income,
    props: props => ({
      budget: props.budget
    })
  },
  incomeVsExpenses: {
    path: "/budgets/:budgetId/income-vs-expenses",
    title: "Income vs Expenses",
    Component: IncomeVsExpenses,
    props: props => ({
      budget: props.budget,
      investmentAccounts: props.investmentAccounts,
      showing: props.settings.incomeVsExpensesShowing
    })
  },
  netWorth: {
    path: "/budgets/:budgetId/net-worth",
    title: "Net Worth",
    Component: NetWorth,
    props: props => ({
      budget: props.budget,
      investmentAccounts: props.investmentAccounts,
      mortgageAccounts: props.mortgageAccounts
    })
  },
  investments: {
    path: "/budgets/:budgetId/investments",
    title: "Investments",
    Component: Investments,
    props: props => ({ budget: props.budget, investmentAccounts: props.investmentAccounts })
  },
  projections: {
    path: "/budgets/:budgetId/projections",
    title: "Retirement Calculator",
    Component: Projections,
    props: props => ({
      budget: props.budget,
      investmentAccounts: props.investmentAccounts,
      mortgageAccounts: props.mortgageAccounts
    })
  },
  settings: {
    path: "/budgets/:budgetId/settings",
    title: "Budget Settings",
    Component: Settings,
    props: props => ({
      budget: props.budget,
      investmentAccounts: props.investmentAccounts,
      mortgageAccounts: props.mortgageAccounts,
      onUpdateAccounts: props.onUpdateAccounts
    })
  }
};

export default pages;
