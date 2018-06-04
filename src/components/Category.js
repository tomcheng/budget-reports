import React from "react";
import PropTypes from "prop-types";
import keyBy from "lodash/keyBy";
import { Link } from "react-router-dom";
import { getGroupLink } from "../utils";
import GetBudget from "./GetBudget";
import Layout from "./Layout";
import BackToBudget from "./BackToBudget";
import { PageTitle } from "./typeComponents";
import Separator from "./Separator";
import PageActions from "./PageActions";
import TopNumbers from "./TopNumbers";
import SpendingChart from "./SpendingChart";
import Transactions from "./Transactions";

const Category = ({
  budget,
  budgetId,
  categoryId,
  currentMonth,
  onRefreshBudget,
  onRequestBudget
}) => (
  <GetBudget
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
      const payees = keyBy(budget.payees, "id");
      const transactions = budget.transactions.filter(
        transaction =>
          transaction.categoryId === categoryId &&
          transaction.date.slice(0, 7) === currentMonth
      );

      return (
        <Layout>
          <Layout.Header flushLeft>
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
            <PageActions
              budgetId={budgetId}
              onRefreshBudget={onRefreshBudget}
            />
          </Layout.Header>
          <Layout.Body>
            <TopNumbers
              numbers={[
                { label: "budgeted", value: category.budgeted },
                { label: "spend", value: -category.activity },
                { label: "available", value: category.balance }
              ]}
            />
            <SpendingChart
              total={category.balance - category.activity}
              currentMonth={currentMonth}
              transactions={transactions}
            />
            <Transactions transactions={transactions} payees={payees} />
          </Layout.Body>
        </Layout>
      );
    }}
  </GetBudget>
);

Category.propTypes = {
  budgetId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
  onRefreshBudget: PropTypes.func.isRequired,
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
    payees: PropTypes.objectOf(
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
