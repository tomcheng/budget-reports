import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import values from "lodash/fp/values";
import moment from "moment";
import { groupBy, notAny, simpleMemoize } from "../dataUtils";
import {
  getFirstMonth,
  getTransactionMonth,
  isIncome,
  isStartingBalanceOrReconciliation,
  isTransfer
} from "../budgetUtils";
import pages, { makeLink } from "../pages";
import MonthExclusions from "./MonthExclusions";
import CategoriesState from "./CategoriesState";

const getFilteredTransactions = simpleMemoize(
  (budget, investmentAccounts, excludeFirstMonth, excludeLastMonth) => {
    const firstMonth = getFirstMonth(budget);
    const lastMonth = moment().format("YYYY-MM");
    return budget.transactions.filter(
      notAny([
        isStartingBalanceOrReconciliation(budget),
        isTransfer(investmentAccounts),
        transaction =>
          excludeFirstMonth && getTransactionMonth(transaction) === firstMonth,
        transaction =>
          excludeLastMonth && getTransactionMonth(transaction) === lastMonth
      ])
    );
  }
);

const getFilteredSpendingTransactions = simpleMemoize(
  (budget, investmentAccounts, excludeFirstMonth, excludeLastMonth) =>
    getFilteredTransactions(
      budget,
      investmentAccounts,
      excludeFirstMonth,
      excludeLastMonth
    ).filter(transaction => !isIncome(budget)(transaction))
);

const trendsPath = pages.groups.path;
const groupedPages = groupBy(
  page => (page.path.startsWith(trendsPath) ? "trendPages" : "otherPages")
)(values(pages));

const PageContent = props =>
  props.budget && (
    <Switch>
      <Route
        path={trendsPath}
        render={({ match }) => (
          <MonthExclusions budget={props.budget}>
            {({
              excludeFirstMonth,
              excludeLastMonth,
              months,
              onSetExclusion
            }) => {
              const filteredTransactions = getFilteredSpendingTransactions(
                props.budget,
                props.investmentAccounts,
                excludeFirstMonth,
                excludeLastMonth
              );

              return (
                <CategoriesState
                  key={match.params.categoryGroupId}
                  action={props.historyAction}
                  location={props.location}
                >
                  {({
                    selectedMonth,
                    selectedGroupId,
                    selectedCategoryId,
                    selectedPayeeId,
                    onSelectMonth,
                    onSelectGroup,
                    onSelectCategory,
                    onSelectPayee
                  }) => (
                    <Switch>
                      {groupedPages.trendPages.map(
                        ({ path, props: propsFunction, Component }) => (
                          <Route
                            key={path}
                            path={path}
                            exact
                            render={({ match }) => (
                              <Component
                                {...propsFunction(props, match.params)}
                                excludeFirstMonth={excludeFirstMonth}
                                excludeLastMonth={excludeLastMonth}
                                months={months}
                                selectedMonth={selectedMonth}
                                selectedGroupId={selectedGroupId}
                                selectedCategoryId={selectedCategoryId}
                                selectedPayeeId={selectedPayeeId}
                                transactions={filteredTransactions}
                                onSelectMonth={onSelectMonth}
                                onSelectGroup={onSelectGroup}
                                onSelectCategory={onSelectCategory}
                                onSelectPayee={onSelectPayee}
                                onSetExclusion={onSetExclusion}
                              />
                            )}
                          />
                        )
                      )}
                    </Switch>
                  )}
                </CategoriesState>
              );
            }}
          </MonthExclusions>
        )}
      />
      <Route
        path={pages.incomeVsExpenses.path}
        exact
        render={({ match }) => {
          const { Component } = pages.incomeVsExpenses;
          return (
            <MonthExclusions budget={props.budget}>
              {({ excludeFirstMonth, excludeLastMonth, onSetExclusion }) => {
                const filteredTransactions = getFilteredTransactions(
                  props.budget,
                  props.investmentAccounts,
                  excludeFirstMonth,
                  excludeLastMonth
                );
                return (
                  <Component
                    {...pages.incomeVsExpenses.props(props, match.params)}
                    excludeFirstMonth={excludeFirstMonth}
                    excludeLastMonth={excludeLastMonth}
                    transactions={filteredTransactions}
                    onSetExclusion={onSetExclusion}
                  />
                );
              }}
            </MonthExclusions>
          );
        }}
      />
      {groupedPages.otherPages.map(
        ({ path, props: propsFunction, Component }) => (
          <Route
            key={path}
            path={path}
            exact
            render={({ match }) => (
              <Component {...propsFunction(props, match.params)} />
            )}
          />
        )
      )}
      <Route
        render={() => (
          <div style={{ padding: 20 }}>
            <Link
              to={makeLink(pages.currentMonth.path, {
                budgetId: props.budget.id
              })}
            >
              Return to {pages.currentMonth.title}
            </Link>
          </div>
        )}
      />
    </Switch>
  );

PageContent.propTypes = {
  currentMonth: PropTypes.string.isRequired,
  historyAction: PropTypes.oneOf(["PUSH", "POP", "REPLACE"]).isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  mortgageAccounts: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  onUpdateAccounts: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default PageContent;
