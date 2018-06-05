import React from "react";
import PropTypes from "prop-types";
import keyBy from "lodash/keyBy";
import sumBy from "lodash/sumBy";
import { getCategoryLink } from "../utils";
import GetBudget from "./GetBudget";
import Layout from "./Layout";
import { PageTitle } from "./typeComponents";
import BackToBudget from "./BackToBudget";
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
      const transactions = budget.transactions.filter(
        transaction =>
          categoryIds.includes(transaction.categoryId) &&
          transaction.date.slice(0, 7) === currentMonth
      );

      const budgeted = sumBy(categories, "budgeted");
      const spent = -sumBy(categories, "activity");
      const available = sumBy(categories, "balance");

      return (
        <Layout>
          <Layout.Header flushLeft flushRight>
            <BackToBudget budgetId={budgetId} />
            <PageTitle
              style={{
                flexGrow: 1,
                alignSelf: "stretch",
                display: "flex",
                alignItems: "center"
              }}
            >
              <Dropdown
                links={categories.map(category => ({
                  to: getCategoryLink({ budgetId, categoryId: category.id }),
                  label: category.name
                }))}
              >
                {({ ref, triggerStyle, onClick }) => (
                  <div
                    ref={ref}
                    onClick={onClick}
                    style={{
                      ...triggerStyle,
                      alignSelf: "stretch",
                      display: "inline-flex",
                      alignItems: "center"
                    }}
                  >
                    {categoryGroup.name}
                    <div style={{ padding: "0 8px", color: "#444" }}>
                      <Icon icon="caret-down" />
                    </div>
                  </div>
                )}
              </Dropdown>
            </PageTitle>
            <PageActions
              onRefreshBudget={onRefreshBudget}
              budgetId={budgetId}
            />
          </Layout.Header>
          <Layout.Body>
            <TopNumbers
              numbers={[
                { label: "budgeted", value: budgeted },
                { label: "spent", value: spent },
                { label: "available", value: available }
              ]}
            />
            <SpendingChart
              currentMonth={currentMonth}
              total={spent + available}
              transactions={transactions}
            />
            <Transactions transactions={transactions} payees={payees} />
          </Layout.Body>
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
