import React, { memo } from "react";
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
import CategoryPage from "./CategoryPage";
import CategoryPayeePage from "./CategoryPayeePage";
import IncomeVsExpensesPage from "./IncomeVsExpensesPage";
import NetWorthPage from "./NetWorthPage";
import InvestmentsPage from "./InvestmentsPage";
import ProjectionsPage from "./ProjectionsPage";
import SettingsPage from "./SettingsPage";

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
  const {
    budget,
    currentMonth,
    historyAction,
    investmentAccounts,
    location,
    mortgageAccounts,
    sidebarTrigger,
    onUpdateAccounts
  } = props;
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
            historyAction={historyAction}
            location={location}
            sidebarTrigger={sidebarTrigger}
            title={pages.currentMonth.title}
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
            historyAction={historyAction}
            location={location}
            sidebarTrigger={sidebarTrigger}
            title={pages.currentMonthGroup.title(match.params, budget)}
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
            historyAction={historyAction}
            location={location}
            sidebarTrigger={sidebarTrigger}
            title={pages.currentMonthCategory.title(match.params, budget)}
          />
        )}
      />
      <Route
        path={pages.income.path}
        exact
        render={() => (
          <IncomePage
            investmentAccounts={investmentAccounts}
            budget={budget}
            historyAction={historyAction}
            location={location}
            sidebarTrigger={sidebarTrigger}
            title={pages.income.title}
          />
        )}
      />
      <Route
        path={pages.incomeVsExpenses.path}
        exact
        render={() => {
          const filteredTransactions = getFilteredTransactions(
            props.budget,
            props.investmentAccounts,
            excludeFirstMonth,
            excludeLastMonth
          );

          return (
            <IncomeVsExpensesPage
              budget={budget}
              excludeFirstMonth={excludeFirstMonth}
              excludeLastMonth={excludeLastMonth}
              investmentAccounts={investmentAccounts}
              historyAction={historyAction}
              location={location}
              sidebarTrigger={sidebarTrigger}
              title={pages.incomeVsExpenses.title}
              transactions={filteredTransactions}
              onSetExclusion={onSetExclusion}
            />
          );
        }}
      />
      <Route
        path={pages.netWorth.path}
        exact
        render={() => (
          <NetWorthPage
            budget={budget}
            historyAction={historyAction}
            investmentAccounts={investmentAccounts}
            location={location}
            mortgageAccounts={mortgageAccounts}
            sidebarTrigger={sidebarTrigger}
            title={pages.netWorth.title}
          />
        )}
      />
      <Route
        path={pages.investments.path}
        exact
        render={() => (
          <InvestmentsPage
            budget={budget}
            investmentAccounts={investmentAccounts}
            title={pages.investments.title}
            historyAction={historyAction}
            location={location}
            sidebarTrigger={sidebarTrigger}
          />
        )}
      />
      <Route
        path={pages.projections.path}
        exact
        render={() => (
          <ProjectionsPage
            budget={budget}
            investmentAccounts={investmentAccounts}
            mortgageAccounts={mortgageAccounts}
            title={pages.projections.title}
            historyAction={historyAction}
            location={location}
            sidebarTrigger={sidebarTrigger}
          />
        )}
      />
      <Route
        path={pages.settings.path}
        exact
        render={() => (
          <SettingsPage
            budget={budget}
            historyAction={historyAction}
            investmentAccounts={investmentAccounts}
            location={location}
            mortgageAccounts={mortgageAccounts}
            sidebarTrigger={sidebarTrigger}
            title={pages.settings.title}
            onUpdateAccounts={onUpdateAccounts}
          />
        )}
      />
      <Route
        path={pages.groups.path}
        render={() => {
          const filteredTransactions = getFilteredSpendingTransactions(
            budget,
            investmentAccounts,
            excludeFirstMonth,
            excludeLastMonth
          );

          return (
            <CategoriesState action={historyAction} location={location}>
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
                        historyAction={historyAction}
                        location={location}
                        months={months}
                        selectedGroupId={selectedGroupId}
                        selectedMonth={selectedMonth}
                        sidebarTrigger={sidebarTrigger}
                        title={pages.groups.title}
                        transactions={filteredTransactions}
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
                        historyAction={historyAction}
                        location={location}
                        months={months}
                        selectedMonth={selectedMonth}
                        selectedCategoryId={selectedCategoryId}
                        sidebarTrigger={sidebarTrigger}
                        title={pages.group.title(match.params, budget)}
                        transactions={filteredTransactions}
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
                      <CategoryPage
                        budget={budget}
                        categoryId={match.params.categoryId}
                        excludeFirstMonth={excludeFirstMonth}
                        excludeLastMonth={excludeLastMonth}
                        historyAction={historyAction}
                        location={location}
                        months={months}
                        selectedMonth={selectedMonth}
                        selectedPayeeId={selectedPayeeId}
                        sidebarTrigger={sidebarTrigger}
                        title={pages.category.title(match.params, budget)}
                        transactions={filteredTransactions}
                        onSetExclusion={onSetExclusion}
                        onSelectMonth={onSelectMonth}
                        onSelectPayee={onSelectPayee}
                      />
                    )}
                  />
                  <Route
                    path={pages.categoryPayee.path}
                    exact
                    render={({ match }) => (
                      <CategoryPayeePage
                        budget={budget}
                        categoryId={match.params.categoryId}
                        excludeFirstMonth={excludeFirstMonth}
                        excludeLastMonth={excludeLastMonth}
                        historyAction={historyAction}
                        location={location}
                        months={months}
                        payeeId={match.params.payeeId}
                        selectedMonth={selectedMonth}
                        sidebarTrigger={sidebarTrigger}
                        title={pages.categoryPayee.title(match.params, budget)}
                        transactions={filteredTransactions}
                        onSetExclusion={onSetExclusion}
                        onSelectMonth={onSelectMonth}
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

const areEqual = (prevProps, nextProps) =>
  [
    "budget",
    "currentMonth",
    "historyAction",
    "investmentAccounts",
    "location",
    "mortgageAccounts"
  ].every(key => prevProps[key] === nextProps[key]);

export default memo(PageContent, areEqual);
