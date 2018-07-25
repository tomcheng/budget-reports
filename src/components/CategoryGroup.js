import React, { Fragment } from "react";
import PropTypes from "prop-types";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import includes from "lodash/fp/includes";
import map from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import sumBy from "lodash/fp/sumBy";
import { getCategoryLink } from "../utils";
import PageWrapper from "./PageWrapper";
import Dropdown from "./Dropdown";
import Icon from "./Icon";
import TopNumbers from "./TopNumbers";
import SpendingChart from "./SpendingChart";
import Transactions from "./Transactions";

const CategoryGroup = ({
  authorized,
  budget,
  budgetId,
  categoryGroupId,
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
      const { categoryGroups, categories: allCategories } = budget;

      const categoryGroup = find(matchesProperty("id", categoryGroupId))(
        categoryGroups
      );
      const categories = filter(
        matchesProperty("categoryGroupId", categoryGroupId)
      )(allCategories);

      return (
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
      );
    }}
    content={() => {
      const {
        payeesById,
        categories: allCategories,
        transactions: allTransactions
      } = budget;

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
        <Fragment>
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
          <Transactions
            budgetId={budgetId}
            payeesById={payeesById}
            transactions={transactionsForMonth}
            linkToPayee
          />
        </Fragment>
      );
    }}
  />
);

CategoryGroup.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  categoryGroupId: PropTypes.string.isRequired,
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

export default CategoryGroup;
