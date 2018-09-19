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
    currentMonth: moment().format("YYYY-MM"),
    settings: {
      payeesSort: "amount",
      incomeVsExpensesShowing: "average"
    }
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

  handleChangeSetting = ({ setting, value }) => {
    this.setState(state => ({
      ...state,
      settings: {
        ...state.settings,
        [setting]: value
      }
    }));
  };

  render() {
    const { hasToken } = this.props;
    const {
      authorized,
      budgetsLoaded,
      budgetIds,
      budgets,
      budgetDetails,
      currentMonth,
      settings
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
                  actions={
                    <PageActions
                      settings={settings}
                      onChangeSetting={this.handleChangeSetting}
                    />
                  }
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
                      settings={settings}
                      historyAction={props.history.action}
                      location={props.location.pathname}
                      onChangeSetting={this.handleChangeSetting}
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
