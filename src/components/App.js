import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import moment from "moment";
import keyBy from "lodash/fp/keyBy";
import {
  getBudgets,
  getUpdatedBudget,
  AUTHORIZE_URL,
  setLastLocation
} from "../ynabRepo";
import {
  setSetting,
  getSetting,
  INVESTMENT_ACCOUNTS,
  MORTGAGE_ACCOUNTS
} from "../uiRepo";
import topLevelPages from "../topLevelPages";
import Unauthorized from "./Unauthorized";
import NotFound from "./NotFound";
import ErrorBoundary from "./ErrorBoundary";
import Budgets from "./Budgets";
import Settings from "./Settings";
import CurrentMonthGroup from "./CurrentMonthGroup";
import Group from "./Group";
import Category from "./Category";
import Payee from "./Payee";

class App extends Component {
  static propTypes = {
    hasToken: PropTypes.bool.isRequired
  };

  state = {
    authorized: true,
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
          budgets: keyBy("id")(budgets)
        },
        callback
      );
    });
  };

  handleRequestBudget = id => {
    getUpdatedBudget(id).then(({ budget, authorized }) => {
      this.setState(state => ({
        ...state,
        authorized,
        budgetDetails: {
          ...state.budgetDetails,
          [id]: budget
        }
      }));
    });
  };

  handleAuthorize = () => {
    setLastLocation();
    window.location.replace(AUTHORIZE_URL);
  };

  render() {
    const { hasToken } = this.props;
    const {
      authorized,
      budgetsLoaded,
      budgetIds,
      budgets,
      budgetDetails,
      currentMonth
    } = this.state;

    if (!hasToken) {
      return <Unauthorized onAuthorize={this.handleAuthorize} />;
    }

    return (
      <ErrorBoundary>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Budgets
                budgets={budgetIds.map(id => budgets[id])}
                budgetsLoaded={budgetsLoaded}
                onRequestBudgets={this.handleRequestBudgets}
              />
            )}
          />
          <Route
            path={`/budgets/:budgetId/settings`}
            exact
            render={props => {
              const { budgetId } = props.match.params;
              return (
                <Settings
                  authorized={authorized}
                  budget={budgetDetails[budgetId]}
                  budgetId={budgetId}
                  investmentAccounts={getSetting(INVESTMENT_ACCOUNTS, budgetId)}
                  mortgageAccounts={getSetting(MORTGAGE_ACCOUNTS, budgetId)}
                  onAuthorize={this.handleAuthorize}
                  onRequestBudget={this.handleRequestBudget}
                  onUpdateAccounts={({ type, value }) => {
                    if (type === "investment") {
                      setSetting(INVESTMENT_ACCOUNTS, budgetId, value);
                    }
                    if (type === "mortgage") {
                      setSetting(MORTGAGE_ACCOUNTS, budgetId, value);
                    }
                    this.forceUpdate();
                  }}
                />
              );
            }}
          />
          {topLevelPages.map(({ path, title, Component }) => (
            <Route
              key={path}
              path={`/budgets/:budgetId${path}`}
              exact
              render={props => {
                const { budgetId } = props.match.params;
                return (
                  <Component
                    authorized={authorized}
                    budget={budgetDetails[budgetId]}
                    budgetId={budgetId}
                    currentMonth={currentMonth}
                    investmentAccounts={getSetting(
                      INVESTMENT_ACCOUNTS,
                      budgetId
                    )}
                    mortgageAccounts={getSetting(MORTGAGE_ACCOUNTS, budgetId)}
                    title={title}
                    onAuthorize={this.handleAuthorize}
                    onRequestBudget={this.handleRequestBudget}
                  />
                );
              }}
            />
          ))}
          <Route
            path="/budgets/:budgetId/current/:categoryGroupId"
            exact
            render={({ match }) => (
              <CurrentMonthGroup
                key={match.params.categoryGroupId}
                authorized={authorized}
                budget={budgetDetails[match.params.budgetId]}
                budgetId={match.params.budgetId}
                categoryGroupId={match.params.categoryGroupId}
                currentMonth={currentMonth}
                onAuthorize={this.handleAuthorize}
                onRequestBudget={this.handleRequestBudget}
              />
            )}
          />
          <Route
            path="/budgets/:budgetId/current/:categoryGroupId/:categoryId"
            exact
            render={({ match }) => (
              <CurrentMonthGroup
                key={match.params.categoryId}
                authorized={authorized}
                budget={budgetDetails[match.params.budgetId]}
                budgetId={match.params.budgetId}
                categoryGroupId={match.params.categoryGroupId}
                categoryId={match.params.categoryId}
                currentMonth={currentMonth}
                onAuthorize={this.handleAuthorize}
                onRequestBudget={this.handleRequestBudget}
              />
            )}
          />
          <Route
            path="/budgets/:budgetId/category-groups/:categoryGroupId"
            exact
            render={props => {
              const { budgetId, categoryGroupId } = props.match.params;
              return (
                <Group
                  authorized={authorized}
                  budget={budgetDetails[budgetId]}
                  budgetId={budgetId}
                  categoryGroupId={categoryGroupId}
                  onAuthorize={this.handleAuthorize}
                  onRequestBudget={this.handleRequestBudget}
                />
              );
            }}
          />
          <Route
            path="/budgets/:budgetId/categories/:categoryId"
            exact
            render={props => {
              const { budgetId, categoryId } = props.match.params;
              return (
                <Category
                  authorized={authorized}
                  budget={budgetDetails[budgetId]}
                  budgetId={budgetId}
                  categoryId={categoryId}
                  onAuthorize={this.handleAuthorize}
                  onRequestBudget={this.handleRequestBudget}
                />
              );
            }}
          />
          <Route
            path="/budgets/:budgetId/payees/:payeeId"
            exact
            render={props => {
              const { budgetId, payeeId } = props.match.params;
              return (
                <Payee
                  authorized={authorized}
                  budget={budgetDetails[budgetId]}
                  budgetId={budgetId}
                  payeeId={payeeId}
                  onAuthorize={this.handleAuthorize}
                  onRequestBudget={this.handleRequestBudget}
                />
              );
            }}
          />
          <Route component={NotFound} />
        </Switch>
      </ErrorBoundary>
    );
  }
}

export default App;
