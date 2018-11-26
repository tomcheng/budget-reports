import React from "react";
import { Switch, Route } from "react-router";
import moment from "moment";
import pages, { makeLink } from "../pages";
import CurrentMonthPage from "./CurrentMonthPage";
import IncomePage from "./IncomePage";
import CurrentMonthGroupPage from "./CurrentMonthGroupPage";
import CurrentMonthCategoryPage from "./CurrentMonthCategoryPage";
import GroupsPage from "./GroupsPage";
import GroupPage from "./GroupPage";
import { Link } from "react-router-dom";
import CategoriesState from "./CategoriesState";
import { notAny, simpleMemoize } from "../dataUtils";
import {
  getFirstMonth,
  getTransactionMonth,
  isIncome,
  isStartingBalanceOrReconciliation,
  isTransfer
} from "../budgetUtils";
import { useMonthExclusions } from "../commonHooks";
import Category from "./Category";

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

const PageContent = props => {
  const { wrapperProps, budget, currentMonth, investmentAccounts } = props;
  const {
    excludeFirstMonth,
    excludeLastMonth,
    months,
    onSetExclusion
  } = useMonthExclusions(budget);

  if (!budget) {
    return null;
  }

  return (
    <Switch>
      <Route
        path={pages.currentMonth.path}
        exact
        render={() => (
          <CurrentMonthPage
            budget={budget}
            currentMonth={currentMonth}
            investmentAccounts={investmentAccounts}
            title={pages.currentMonth.title}
            wrapperProps={wrapperProps}
          />
        )}
      />
      <Route
        path={pages.currentMonthGroup.path}
        exact
        render={({ match }) => (
          <CurrentMonthGroupPage
            budget={budget}
            categoryGroupId={match.params.categoryGroupId}
            currentMonth={currentMonth}
            title={pages.currentMonthGroup.title(match.params, budget)}
            wrapperProps={wrapperProps}
          />
        )}
      />
      <Route
        path={pages.currentMonthCategory.path}
        exact
        render={({ match }) => (
          <CurrentMonthCategoryPage
            categoryId={match.params.categoryId}
            budget={budget}
            currentMonth={currentMonth}
            categoryGroupId={match.params.categoryGroupId}
            title={pages.currentMonthCategory.title(match.params, budget)}
            wrapperProps={wrapperProps}
          />
        )}
      />
      <Route
        page={pages.groups.path}
        render={({ match, history, location }) => {
          const filteredTransactions = getFilteredSpendingTransactions(
            budget,
            investmentAccounts,
            excludeFirstMonth,
            excludeLastMonth
          );

          return (
            <CategoriesState
              action={history.action}
              location={location.pathname}
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
                  <Route
                    path={pages.groups.path}
                    exact
                    render={() => (
                      <GroupsPage
                        budget={budget}
                        excludeFirstMonth={excludeFirstMonth}
                        excludeLastMonth={excludeLastMonth}
                        months={months}
                        selectedGroupId={selectedGroupId}
                        selectedMonth={selectedMonth}
                        title={pages.groups.title}
                        transactions={filteredTransactions}
                        wrapperProps={wrapperProps}
                        onSelectGroup={onSelectGroup}
                        onSetExclusion={onSetExclusion}
                        onSelectMonth={onSelectMonth}
                      />
                    )}
                  />
                  <Route
                    path={pages.group.path}
                    exact
                    render={({ match }) => (
                      <GroupPage
                        budget={budget}
                        categoryGroupId={match.params.categoryGroupId}
                        excludeFirstMonth={excludeFirstMonth}
                        excludeLastMonth={excludeLastMonth}
                        months={months}
                        selectedMonth={selectedMonth}
                        selectedCategoryId={selectedCategoryId}
                        title={pages.group.title(match.params, budget)}
                        transactions={filteredTransactions}
                        wrapperProps={wrapperProps}
                        onSelectCategory={onSelectCategory}
                        onSelectMonth={onSelectMonth}
                        onSetExclusion={onSetExclusion}
                      />
                    )}
                  />
                  <Route
                    path={pages.category.path}
                    exact
                    render={({ match }) => (
                      <Category
                        budget={budget}
                        categoryId={match.params.categoryId}
                        excludeFirstMonth={excludeFirstMonth}
                        excludeLastMonth={excludeLastMonth}
                        months={months}
                        selectedMonth={selectedMonth}
                        selectedPayeeId={selectedPayeeId}
                        title={pages.category.title(match.params, budget)}
                        transactions={filteredTransactions}
                        wrapperProps={wrapperProps}
                        onSetExclusion={onSetExclusion}
                        onSelectMonth={onSelectMonth}
                        onSelectPayee={onSelectPayee}
                      />
                    )}
                  />
                </Switch>
              )}
            </CategoriesState>
          );
        }}
      />
      <Route
        path={pages.income.path}
        exact
        render={() => (
          <IncomePage
            investmentAccounts={investmentAccounts}
            budget={budget}
            title={pages.income.title}
            wrapperProps={wrapperProps}
          />
        )}
      />
      <Route
        render={() => (
          <div style={{ padding: 20 }}>
            <Link
              to={makeLink(pages.currentMonth.path, {
                budgetId: budget.id
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
export default PageContent;
