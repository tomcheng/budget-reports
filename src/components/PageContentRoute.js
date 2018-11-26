import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import pick from "lodash/fp/pick";
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
import { useMonthExclusions } from "../commonHooks";
import pages, { makeLink } from "../pages";
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

const getFilteredIncomeTransactions = simpleMemoize(
  (budget, investmentAccounts, excludeFirstMonth, excludeLastMonth) =>
    getFilteredTransactions(
      budget,
      investmentAccounts,
      excludeFirstMonth,
      excludeLastMonth
    )
      .filter(transaction => isIncome(budget)(transaction))
      .map(transaction => ({ ...transaction, amount: -transaction.amount }))
);

const trendsPath = pages.groups.path;
const groupedPages = groupBy(
  page => (page.path.startsWith(trendsPath) ? "trendPages" : "otherPages")
)(values(pages));

const PageContentRoute = props => {
  if (!props.budget) {
    return null;
  }

  const {
    excludeFirstMonth,
    excludeLastMonth,
    months,
    onSetExclusion
  } = useMonthExclusions(props.budget);

  return (
    <Switch>
      <Route
        path={trendsPath}
        render={({ match }) => {
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
                    ({ path, props: propsList, paramProps, Component }) => (
                      <Route
                        key={path}
                        path={path}
                        exact
                        render={({ match }) => (
                          <Component
                            {...pick(propsList)(props)}
                            {...pick(paramProps || [])(match.params)}
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
      />
      <Route
        path={pages.income.path}
        exact
        render={() => {
          const { Component, props: propsList } = pages.income;
          const filteredTransactions = getFilteredIncomeTransactions(
            props.budget,
            props.investmentAccounts,
            excludeFirstMonth,
            excludeLastMonth
          );
          return (
            <Component
              {...pick(propsList)(props)}
              excludeFirstMonth={excludeFirstMonth}
              excludeLastMonth={excludeLastMonth}
              months={months}
              transactions={filteredTransactions}
              onSetExclusion={onSetExclusion}
            />
          );
        }}
      />
      <Route
        path={pages.incomeVsExpenses.path}
        exact
        render={() => {
          const { Component, props: propsList } = pages.incomeVsExpenses;
          const filteredTransactions = getFilteredTransactions(
            props.budget,
            props.investmentAccounts,
            excludeFirstMonth,
            excludeLastMonth
          );
          return (
            <Component
              {...pick(propsList)(props)}
              excludeFirstMonth={excludeFirstMonth}
              excludeLastMonth={excludeLastMonth}
              transactions={filteredTransactions}
              onSetExclusion={onSetExclusion}
            />
          );
        }}
      />
      {groupedPages.otherPages.map(
        ({ path, props: propsList, paramProps, Component }) => (
          <Route
            key={path}
            path={path}
            exact
            render={({ match }) => (
              <Component
                {...pick(propsList)(props)}
                {...pick(paramProps || [])(match.params)}
              />
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
};

PageContentRoute.propTypes = {
  currentMonth: PropTypes.string.isRequired,
  historyAction: PropTypes.oneOf(["PUSH", "POP", "REPLACE"]).isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  mortgageAccounts: PropTypes.object.isRequired,
  onUpdateAccounts: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default PageContentRoute;
