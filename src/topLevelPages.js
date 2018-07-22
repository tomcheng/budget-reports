import Budget from "./components/Budget";
import Payees from "./components/Payees";
import IncomeVsExpenses from "./components/IncomeVsExpenses";
import NetWorth from "./components/NetWorth";
import Projections from "./components/Projections";

export default [
  { path: "", title: "Current Month Budget", Component: Budget },
  { path: "/payees", title: "Payees", Component: Payees },
  {
    path: "/income-vs-expenses",
    title: "Income vs Expenses",
    Component: IncomeVsExpenses
  },
  { path: "/net-worth", title: "Net Worth", Component: NetWorth },
  { path: "/projections", title: "Projections", Component: Projections }
];
