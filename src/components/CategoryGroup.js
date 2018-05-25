import React from "react";
import PropTypes from "prop-types";
import keyBy from "lodash/keyBy";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import GetBudget from "./GetBudget";
import MainLayout from "./MainLayout";
import SpendingChart from "./SpendingChart";
import Transaction from "./Transaction";

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
      const transactions = sortBy(
        budget.transactions.filter(
          transaction =>
            categoryIds.includes(transaction.categoryId) &&
            transaction.date.slice(0, 7) === currentMonth
        ),
        "date"
      ).reverse();

      return (
        <MainLayout
          title={categoryGroup.name}
          budgetId={budgetId}
          onRefreshBudget={onRefreshBudget}
        >
          <div style={{ padding: "0 20px 20px" }}>
            <SpendingChart
              budgeted={sumBy(categories, "budgeted")}
              currentMonth={currentMonth}
              transactions={transactions}
            />
          </div>
          <div style={{ padding: "0 20px 20px" }}>
            {transactions.map(({ id, payeeId, date, amount }) => (
              <Transaction
                key={id}
                payee={payees[payeeId]}
                date={date}
                amount={amount}
              />
            ))}
          </div>
        </MainLayout>
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
