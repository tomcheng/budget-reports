import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Route, Switch } from "react-router-dom";
import moment from "moment";
import get from "lodash/get";
import keyBy from "lodash/keyBy";
import sortBy from "lodash/sortBy";
import {
  getBudgets,
  getBudget,
  getUpdatedBudget,
  AUTHORIZE_URL
} from "../ynabRepo";
import Unauthorized from "./Unauthorized";
import Loading from "./Loading";
import NotFound from "./NotFound";
import Budgets from "./Budgets";
import Budget from "./Budget";
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
    currentMonth: moment().format("YYYY-MM")
  };

  componentDidMount() {
    if (!this.props.isAuthorized) {
      return;
    }

    getBudgets().then(({ budgets }) => {
      this.setState(
        {
          budgetsLoaded: true,
          budgetIds: budgets.map(b => b.id),
          budgets: keyBy(budgets, "id"),
          selectedBudgetId:
            budgets.length === 1 ? get(budgets, [0, "id"]) : null
        },
        () => {
          budgets.forEach(({ id }) => {
            getBudget(id).then(budget => {
              this.setState(state => ({
                ...state,
                budgets: {
                  ...state.budgets,
                  [id]: {
                    ...state.budgets[id],
                    ...budget,
                    detailsLoaded: true
                  }
                }
              }));
            });
          });
        }
      );
    });
  }

  handleRefreshData = budgetId => {
    getUpdatedBudget(budgetId).then(budget => {
      this.setState(state => ({
        ...state,
        budgets: {
          ...state.budgets,
          [budgetId]: {
            ...state.budgets[budgetId],
            ...budget
          }
        }
      }));
    });
  };

  handleAuthorize = () => {
    window.location.replace(AUTHORIZE_URL);
  };

  render() {
    const { isAuthorized } = this.props;
    const { budgetsLoaded, budgetIds, budgets, currentMonth } = this.state;

    if (!isAuthorized) {
      return <Unauthorized onAuthorize={this.handleAuthorize} />;
    }

    if (!budgetsLoaded) {
      return <Loading />;
    }

    return (
      <Container>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Budgets budgets={budgetIds.map(id => budgets[id])} />
            )}
          />
          <Route
            path="/budgets/:budgetId"
            exact
            render={({ match }) => {
              const budget = budgets[match.params.budgetId];

              if (!budget) {
                return <NotFound />;
              }

              if (!budget.detailsLoaded) {
                return <Loading />;
              }

              return <Budget budget={budget} currentUrl={match.url} />;
            }}
          />
          <Route
            path="/budgets/:budgetId/categories/:categoryId"
            exact
            render={({ match }) => {
              const { budgetId, categoryId } = match.params;
              const budget = budgets[budgetId];

              if (!budget) {
                return <NotFound />;
              }

              if (!budget.detailsLoaded) {
                return <Loading />;
              }

              const category = budget.categories.find(c => c.id === categoryId);

              if (!category) {
                return <NotFound />;
              }

              const transactions = sortBy(
                budget.transactions.filter(
                  transaction =>
                    transaction.categoryId === categoryId &&
                    transaction.date.slice(0, 7) === currentMonth
                ),
                "date"
              ).reverse();

              return (
                <Category
                  category={category}
                  currentMonth={currentMonth}
                  payees={budget.payees}
                  transactions={transactions}
                  onRefreshData={() => {
                    this.handleRefreshData(budgetId);
                  }}
                />
              );
            }}
          />
          <Route component={NotFound} />
        </Switch>
      </Container>
    );
  }
}

export default App;
