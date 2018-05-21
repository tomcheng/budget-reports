import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import moment from "moment";
import get from "lodash/get";
import keyBy from "lodash/keyBy";
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
                    ...budget
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
      <div>
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

              return <Budget budget={budget} currentUrl={match.url} />;
            }}
          />
          <Route
            path="/budgets/:budgetId/categories/:categoryId"
            exact
            render={({ match }) => {
              const { budgetId, categoryId } = match.params;
              const budget = budgets[budgetId];

              if (!budget.categories) {
                return <Loading />;
              }

              const category = budget.categories.find(c => c.id === categoryId);

              if (!category) {
                return <NotFound />;
              }

              const transactions = budget.transactions.filter(
                t =>
                  t.categoryId === categoryId &&
                  t.date.slice(0, 7) === currentMonth
              );

              return (
                <Category
                  category={category}
                  currentMonth={currentMonth}
                  payees={budget.payees}
                  transactions={transactions}
                  onRefreshData={() => { this.handleRefreshData(budgetId) }}
                />
              );
            }}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
