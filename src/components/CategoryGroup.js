import React from "react";
import PropTypes from "prop-types";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import includes from "lodash/fp/includes";
import map from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import sumBy from "lodash/fp/sumBy";
import { getCategoryLink } from "../utils";
import EnsureBudgetLoaded from "./EnsureBudgetLoaded";
import Layout from "./Layout";
import { PageTitle } from "./typeComponents";
import BackToBudget from "./BackToBudget";
import Dropdown from "./Dropdown";
import Icon from "./Icon";
import TopNumbers from "./TopNumbers";
import SpendingChart from "./SpendingChart";
import Transactions from "./Transactions";

const CategoryGroup = ({
  budget,
  budgetId,
  categoryGroupId,
  currentMonth,
  onRequestBudget
}) => (
  <EnsureBudgetLoaded
    budgetId={budgetId}
    budgetLoaded={!!budget}
    onRequestBudget={onRequestBudget}
  >
    {() => {
      const {
        categoryGroups,
        payeesById,
        categories: allCategories,
        transactions: allTransactions
      } = budget;

      const categoryGroup = find(matchesProperty("id", categoryGroupId))(
        categoryGroups
      );
      const categories = filter(
        matchesProperty("categoryGroupId", categoryGroupId)
      )(allCategories);
      const categoryIds = map("id")(categories);
      const transactionsInGroup = filter(transaction =>
        includes(transaction.categoryId)(categoryIds)
      )(allTransactions);
      const transactionsForMonth = filter(
        transaction => transaction.date.slice(0, 7) === currentMonth
      )(transactionsInGroup);

      const budgeted = sumBy("budgeted")(categories);
      const spent = -sumBy("activity")(categories);
      const available = sumBy("balance")(categories);

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
              budgetId={budgetId}
              currentMonth={currentMonth}
              total={spent + available}
              transactions={transactionsInGroup}
            />
            <Transactions transactions={transactionsForMonth} payeesById={payeesById} />
          </Layout.Body>
        </Layout>
      );
    }}
  </EnsureBudgetLoaded>
);

CategoryGroup.propTypes = {
  budgetId: PropTypes.string.isRequired,
  categoryGroupId: PropTypes.string.isRequired,
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

export default CategoryGroup;
