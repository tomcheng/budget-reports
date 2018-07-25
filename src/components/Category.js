import React, { Fragment } from "react";
import PropTypes from "prop-types";
import propEq from "lodash/fp/propEq";
import { Link } from "react-router-dom";
import { getGroupLink } from "../utils";
import PageWrapper from "./PageWrapper";
import Separator from "./Separator";
import TopNumbers from "./TopNumbers";
import SpendingChart from "./SpendingChart";
import Transactions from "./Transactions";

const Category = ({
  authorized,
  budget,
  budgetId,
  categoryId,
  currentMonth,
  onAuthorize,
  onRequestBudget
}) => (
  <PageWrapper
    authorized={authorized}
    budgetId={budgetId}
    budgetLoaded={!!budget}
    backLink
    onAuthorize={onAuthorize}
    onRequestBudget={onRequestBudget}
    title={() => {
      const category = budget.categories.find(
        category => category.id === categoryId
      );
      const categoryGroup = budget.categoryGroups.find(
        group => group.id === category.categoryGroupId
      );

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to={getGroupLink({
              budgetId,
              categoryGroupId: categoryGroup.id
            })}
            replace
          >
            {categoryGroup.name}
          </Link>
          <Separator />
          {category.name}
        </div>
      );
    }}
    content={() => {
      const category = budget.categories.find(
        category => category.id === categoryId
      );
      const transactionsForCategory = budget.transactions.filter(
        propEq("categoryId", categoryId)
      );
      const transactionsForMonth = transactionsForCategory.filter(
        transaction => transaction.date.slice(0, 7) === currentMonth
      );

      return (
        <Fragment>
          <TopNumbers
            numbers={[
              { label: "budgeted", value: category.budgeted },
              { label: "spent", value: -category.activity },
              { label: "available", value: category.balance }
            ]}
          />
          <SpendingChart
            budgetId={budgetId}
            total={category.balance - category.activity}
            currentMonth={currentMonth}
            transactions={transactionsForCategory}
          />
          <Transactions
            transactions={transactionsForMonth}
            payeesById={budget.payeesById}
            budgetId={budgetId}
            linkToPayee
          />
        </Fragment>
      );
    }}
  />
);

/*
  <EnsureBudgetLoaded
    budgetId={budgetId}
    budgetLoaded={!!budget}
    onRequestBudget={onRequestBudget}
  >
    {() => {
      const category = budget.categories.find(
        category => category.id === categoryId
      );
      const categoryGroup = budget.categoryGroups.find(
        group => group.id === category.categoryGroupId
      );
      const transactionsForCategory = budget.transactions.filter(
        propEq("categoryId", categoryId)
      );
      const transactionsForMonth = transactionsForCategory.filter(
        transaction => transaction.date.slice(0, 7) === currentMonth
      );

      return (
        <Layout>
          <Layout.Header flushLeft flushRight>
            <BackLink />
            <PageTitle
              style={{ flexGrow: 1, display: "flex", alignItems: "center" }}
            >
              <Link
                to={getGroupLink({
                  budgetId,
                  categoryGroupId: categoryGroup.id
                })}
              >
                {categoryGroup.name}
              </Link>
              <Separator />
              {category.name}
            </PageTitle>
          </Layout.Header>
          <Layout.Body>
            <TopNumbers
              numbers={[
                { label: "budgeted", value: category.budgeted },
                { label: "spent", value: -category.activity },
                { label: "available", value: category.balance }
              ]}
            />
            <SpendingChart
              budgetId={budgetId}
              total={category.balance - category.activity}
              currentMonth={currentMonth}
              transactions={transactionsForCategory}
            />
            <Transactions
              transactions={transactionsForMonth}
              payeesById={budget.payeesById}
              budgetId={budgetId}
              linkToPayee
            />
          </Layout.Body>
        </Layout>
      );
    }}
  </EnsureBudgetLoaded>
 */

Category.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.shape({
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        activity: PropTypes.number.isRequired,
        balance: PropTypes.number.isRequired,
        budgeted: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    payeesById: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        payeeId: PropTypes.string.isRequired
      })
    ).isRequired
  })
};

export default Category;
