import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Route, Switch } from "react-router-dom";
import moment from "moment";
import keyBy from "lodash/keyBy";
import {
  getBudgets,
  getBudget,
  getUpdatedBudget,
  AUTHORIZE_URL
} from "../ynabRepo";
import Unauthorized from "./Unauthorized";
import NotFound from "./NotFound";
import ErrorBoundary from "./ErrorBoundary";
import Budgets from "./Budgets";
import Budget from "./Budget";
import CategoryGroup from "./CategoryGroup";
import Category from "./Category";

const Container = styled.div`
  font-family: Roboto, Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #444;
  font-size: 14px;
  line-height: 22px;
  a {
    color: inherit;
    text-decoration: none;
  }
`;

class App extends Component {
  static propTypes = {
    isAuthorized: PropTypes.bool.isRequired
  };

  state = {
    budgetsLoaded: false,
    budgetIds: [],
    budgets: {},
    budgetDetails: {},
    currentMonth: moment().format("YYYY-MM")
  };

  handleRequestBudgets = callback => {
    getBudgets().then(({ budgets }) => {
      this.setState(
        {
          budgetsLoaded: true,
          budgetIds: budgets.map(b => b.id),
          budgets: keyBy(budgets, "id")
        },
        callback
      );
    });
  };

  handleRequestBudget = id => {
    getBudget(id).then(budget => {
      this.setState(state => ({
        ...state,
        budgetDetails: {
          ...state.budgetDetails,
          [id]: budget
        }
      }));
    });
  };

  handleRefreshBudget = id => {
    getUpdatedBudget(id).then(budget => {
      this.setState(state => ({
        ...state,
        budgetDetails: {
          ...state.budgetDetails,
          [id]: budget
        }
      }));
    });
  };

  handleAuthorize = () => {
    window.location.replace(AUTHORIZE_URL);
  };

  render() {
    const { isAuthorized } = this.props;
    const {
      budgetsLoaded,
      budgetIds,
      budgets,
      budgetDetails,
      currentMonth
    } = this.state;

    if (!isAuthorized) {
      return <Unauthorized onAuthorize={this.handleAuthorize} />;
    }

    return (
      <Container>
        <ErrorBoundary>
          <Switch>
            <Route
              path="/"
              exact
              render={() => (
                <Budgets
                  budgetsLoaded={budgetsLoaded}
                  budgets={budgetIds.map(id => budgets[id])}
                  onRequestBudgets={this.handleRequestBudgets}
                />
              )}
            />
            <Route
              path="/budgets/:budgetId"
              exact
              render={({ match }) => (
                <Budget
                  budget={budgetDetails[match.params.budgetId]}
                  budgetId={match.params.budgetId}
                  currentMonth={currentMonth}
                  onRefreshBudget={this.handleRefreshBudget}
                  onRequestBudget={this.handleRequestBudget}
                />
              )}
            />
            <Route
              path="/budgets/:budgetId/category-groups/:categoryGroupId"
              exact
              render={({ match }) => (
                <CategoryGroup
                  budget={budgetDetails[match.params.budgetId]}
                  budgetId={match.params.budgetId}
                  categoryGroupId={match.params.categoryGroupId}
                  currentMonth={currentMonth}
                  onRefreshBudget={this.handleRefreshBudget}
                  onRequestBudget={this.handleRequestBudget}
                />
              )}
            />
            <Route
              path="/budgets/:budgetId/categories/:categoryId"
              exact
              render={({ match }) => (
                <Category
                  budget={budgetDetails[match.params.budgetId]}
                  budgetId={match.params.budgetId}
                  categoryId={match.params.categoryId}
                  currentMonth={currentMonth}
                  onRefreshBudget={this.handleRefreshBudget}
                  onRequestBudget={this.handleRequestBudget}
                />
              )}
            />
            <Route component={NotFound} />
          </Switch>
        </ErrorBoundary>
      </Container>
    );
  }
}

export default App;
