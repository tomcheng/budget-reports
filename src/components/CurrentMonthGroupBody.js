import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { getTransactionMonth } from "../utils";
import { sumByProp } from "../optimized";
import DayByDaySection from "./DayByDaySection";
import TransactionsSection from "./TransactionsSection";

class CurrentMonthGroupBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      categories: PropTypes.array.isRequired,
      id: PropTypes.string.isRequired,
      payeesById: PropTypes.object.isRequired,
      transactions: PropTypes.array.isRequired
    }).isRequired,
    categoryGroupId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    selectedCategoryId: PropTypes.string
  };

  render() {
    const {
      budget,
      categoryGroupId,
      currentMonth,
      selectedCategoryId
    } = this.props;
    const {
      id: budgetId,
      payeesById,
      categories: allCategories,
      categoriesById,
      transactions: allTransactions
    } = budget;

    const categories = allCategories.filter(
      category => category.categoryGroupId === categoryGroupId
    );
    const selectedCategory =
      selectedCategoryId && categoriesById[selectedCategoryId];
    const categoryIds = categories.map(category => category.id);
    const transactionsInCategory =
      selectedCategoryId &&
      allTransactions.filter(
        transaction => transaction.categoryId === selectedCategoryId
      );
    const transactionsInCategoryForMonth =
      transactionsInCategory &&
      transactionsInCategory.filter(
        transaction => getTransactionMonth(transaction) === currentMonth
      );
    const transactionsInGroup = allTransactions.filter(transaction =>
      categoryIds.includes(transaction.categoryId)
    );
    const transactionsInGroupForMonth = transactionsInGroup.filter(
      transaction => getTransactionMonth(transaction) === currentMonth
    );

    const spent = selectedCategory
      ? -selectedCategory.activity
      : -sumByProp("activity")(categories);
    const available = selectedCategory
      ? selectedCategory.balance
      : sumByProp("balance")(categories);

    return (
      <Fragment>
        <DayByDaySection
          key={selectedCategory ? selectedCategory.name : "day-by-day"}
          budgetId={budgetId}
          currentMonth={currentMonth}
          title={
            selectedCategory ? `${selectedCategory.name} Day by Day` : "Day by Day"
          }
          transactions={transactionsInCategory || transactionsInGroup}
          total={spent + available}
        />
        <TransactionsSection
          budgetId={budgetId}
          payeesById={payeesById}
          title={
            selectedCategory
              ? `${selectedCategory.name} Transactions`
              : "Transactions"
          }
          transactions={
            transactionsInCategoryForMonth || transactionsInGroupForMonth
          }
          linkToPayee
        />
      </Fragment>
    );
  }
}

export default CurrentMonthGroupBody;
