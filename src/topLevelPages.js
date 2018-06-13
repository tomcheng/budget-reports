import Budget from "./components/Budget";
import IncomeVsExpenses from "./components/IncomeVsExpenses";
import NetWorth from "./components/NetWorth";

export default [
  { path: "", title: "Current Month Budget", Component: Budget },
  {
    path: "/income-vs-expenses",
    title: "Income vs Expenses",
    Component: IncomeVsExpenses
  },
  { path: "/net-worth", title: "Net Worth", Component: NetWorth }
];
