import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import propEq from "lodash/fp/propEq";
import { getGroupLink } from "../utils";
import EnsureBudgetLoaded from "./EnsureBudgetLoaded";
import Layout from "./Layout";
import BackToBudget from "./BackToBudget";
import { PageTitle } from "./typeComponents";
import Separator from "./Separator";
import TopNumbers from "./TopNumbers";
import SpendingChart from "./SpendingChart";
import Transactions from "./Transactions";

const Category = ({
  budget,
  budgetId,
  categoryId,
  currentMonth,
  onRequestBudget
}) => (
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
            <BackToBudget budgetId={budgetId} />
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
              total={category.balance - category.activity}
              currentMonth={currentMonth}
              transactions={transactionsForCategory}
            />
            <Transactions
              transactions={transactionsForMonth}
              payeesById={budget.payeesById}
            />
          </Layout.Body>
        </Layout>
      );
    }}
  </EnsureBudgetLoaded>
);

Category.propTypes = {
  budgetId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
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
