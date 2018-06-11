import React, { Component } from "react";
import PropTypes from "prop-types";
import EnsureBudgetLoaded from "../EnsureBudgetLoaded";
import Layout from "../common/Layout";
import BackToBudget from "../header/BackToBudget";
import { PageTitle } from "../common/typeComponents";
import PageActions from "../header/PageActions";
import IncomeVsExpensesBody from "./IncomeVsExpensesBody";

class IncomeVsExpenses extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    onRefreshBudget: PropTypes.func.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
    budget: PropTypes.object
  };

  render() {
    const { budget, budgetId, onRefreshBudget, onRequestBudget } = this.props;

    return (
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
              <PageActions
                budgetId={budgetId}
                onRefreshBudget={onRefreshBudget}
              />
            </Layout.Header>
            <Layout.Body>
              <IncomeVsExpensesBody budget={budget} />
            </Layout.Body>
          </Layout>
        )}
      </EnsureBudgetLoaded>
    );
  }
}

export default IncomeVsExpenses;
