import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import EnsureBudgetLoaded from "./EnsureBudgetLoaded";
import Layout from "./Layout";
import BackToBudget from "./BackToBudget";
import { PageTitle } from "./typeComponents";
import PageActions from "./PageActions";
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
          <Fragment>
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
          </Fragment>
        )}
      </EnsureBudgetLoaded>
    );
  }
}

export default IncomeVsExpenses;
