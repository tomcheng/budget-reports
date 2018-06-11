import React from "react";
import PropTypes from "prop-types";
import EnsureBudgetLoaded from "../EnsureBudgetLoaded";
import Layout from "../common/Layout";
import BackToBudget from "../header/BackToBudget";
import { PageTitle } from "../common/typeComponents";
import PageActions from "../header/PageActions";
import IncomeVsExpensesBody from "./IncomeVsExpensesBody";

const IncomeVsExpenses = ({
  budget,
  budgetId,
  onRequestBudget,
  onRefreshBudget
}) => (
  <EnsureBudgetLoaded
    budgetId={budgetId}
    budgetLoaded={!!budget}
    onRequestBudget={onRequestBudget}
  >
    {() => (
      <Layout>
        <Layout.Header flushLeft flushRight>
          <BackToBudget budgetId={budgetId} />
          <PageTitle style={{ flexGrow: 1 }}>Income vs Expenses</PageTitle>
          <PageActions budgetId={budgetId} onRefreshBudget={onRefreshBudget} />
        </Layout.Header>
        <Layout.Body>
          <IncomeVsExpensesBody budget={budget} />
        </Layout.Body>
      </Layout>
    )}
  </EnsureBudgetLoaded>
);

IncomeVsExpenses.propTypes = {
  budgetId: PropTypes.string.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  onRefreshBudget: PropTypes.func.isRequired,
  budget: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};

export default IncomeVsExpenses;
