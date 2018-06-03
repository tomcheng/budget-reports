import React from "react";
import PropTypes from "prop-types";
import keyBy from "lodash/keyBy";
import sumBy from "lodash/sumBy";
import { getCategoryLink, getBudgetLink } from "../utils";
import { Link } from "react-router-dom";
import GetBudget from "./GetBudget";
import Layout from "./Layout";
import { PageTitle } from "./typeComponents";
import Dropdown from "./Dropdown";
import Icon from "./Icon";
import PageActions from "./PageActions";
import TopNumbers from "./TopNumbers";
import SpendingChart from "./SpendingChart";
import Transactions from "./Transactions";

const CategoryGroup = ({
  budget,
  budgetId,
  categoryGroupId,
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
      const categoryGroup = budget.categoryGroups.find(
        group => group.id === categoryGroupId
      );
      const categories = budget.categories.filter(
        category => category.categoryGroupId === categoryGroupId
      );
      const categoryIds = categories.map(category => category.id);

      const payees = keyBy(budget.payees, "id");
      const transactions = budget.transactions
        .filter(
          transaction =>
            categoryIds.includes(transaction.categoryId) &&
            transaction.date.slice(0, 7) === currentMonth
        )
        .reverse();

      const budgeted = sumBy(categories, "budgeted");
      const spent = -sumBy(categories, "activity");
      const available = sumBy(categories, "balance");

      return (
        <Layout>
          <Layout.Header>
            <PageTitle>
              <Link to={getBudgetLink({ budgetId })}>
                <Icon icon="arrow-left" />
              </Link>
              <Dropdown
                links={categories.map(category => ({
                  to: getCategoryLink({ budgetId, categoryId: category.id }),
                  label: category.name
                }))}
              >
                {({ ref, onClick }) => (
                  <span ref={ref} onClick={onClick}>
                    {categoryGroup.name} <Icon icon="caret-down" />
                  </span>
                )}
              </Dropdown>
            </PageTitle>
            <PageActions
              onRefreshBudget={onRefreshBudget}
              budgetId={budgetId}
            />
          </Layout.Header>
          <Layout.Content>
            <TopNumbers
              budgeted={budgeted}
              spent={spent}
              available={available}
            />
            <SpendingChart
              currentMonth={currentMonth}
              total={spent + available}
              transactions={transactions}
            />
            <Transactions transactions={transactions} payees={payees} />
          </Layout.Content>
        </Layout>
      );
    }}
  </GetBudget>
);

CategoryGroup.propTypes = {
  budgetId: PropTypes.string.isRequired,
  categoryGroupId: PropTypes.string.isRequired,
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

export default CategoryGroup;
