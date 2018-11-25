import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import moment from "moment";
import get from "lodash/fp/get";
import keyBy from "lodash/fp/keyBy";
import {
  getBudgets,
  getUpdatedBudget,
  AUTHORIZE_URL,
  setLastLocation
} from "../ynabRepo";
import { setSetting, getSetting } from "../uiRepo";
import PageWrapper from "./PageWrapper";
import PageTitle from "./PageTitle";
import PageBreadcrumbs from "./PageBreadcrumbs";
import PageActions from "./PageActions";
import PageContent from "./PageContent";
import Unauthorized from "./Unauthorized";
import NotFound from "./NotFound";
import ErrorBoundary from "./ErrorBoundary";
import Budgets from "./Budgets";
import CurrencyContext from "./CurrencyContext";

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
            path="/budgets/:budgetId"
            render={props => {
              const { budgetId } = props.match.params;
              const budget = budgetDetails[budgetId];

              return (
                <CurrencyContext.Provider value={get("currencyFormat")(budget)}>
                  <PageWrapper
                    authorized={authorized}
                    budgetId={budgetId}
                    budgetLoaded={!!budget}
                    hasMultipleBudgets={budgetIds.length > 1}
                    historyAction={props.history.action}
                    location={props.location.pathname}
                    onAuthorize={this.handleAuthorize}
                    onRequestBudget={this.handleRequestBudget}
                    title={<PageTitle budget={budget} />}
                    breadcrumbs={<PageBreadcrumbs budget={budget} />}
                    actions={<PageActions />}
                    content={
                      <PageContent
                        budget={budget}
                        currentMonth={currentMonth}
                        investmentAccounts={getSetting(
                          "investmentAccounts",
                          budgetId
                        )}
                        mortgageAccounts={getSetting(
                          "mortgageAccounts",
                          budgetId
                        )}
                        historyAction={props.history.action}
                        location={props.location.pathname}
                        onUpdateAccounts={({ type, value }) => {
                          if (type === "investment") {
                            setSetting("investmentAccounts", budgetId, value);
                          }
                          if (type === "mortgage") {
                            setSetting("mortgageAccounts", budgetId, value);
                          }
                          this.forceUpdate();
                        }}
                      />
                    }
                  />
                </CurrencyContext.Provider>
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
