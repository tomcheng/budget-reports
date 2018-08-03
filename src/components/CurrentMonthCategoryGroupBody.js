import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import { getTransactionMonth } from "../utils";
import { sumByProp } from "../optimized";
import { TopSection } from "./Section";
import TopNumbers from "./TopNumbers";
import ProgressSection from "./ProgressSection";
import CategoryBreakdown from "./CategoryBreakdown";
import Transactions from "./Transactions";

class CurrentMonthCategoryGroupBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      categories: PropTypes.array.isRequired,
      id: PropTypes.string.isRequired,
      payeesById: PropTypes.object.isRequired,
      transactions: PropTypes.array.isRequired
    }).isRequired,
    categoryGroupId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    selectedCategoryId: PropTypes.string
  };

  render() {
    const {
      budget,
      categoryGroupId,
      currentMonth,
      selectedCategoryId,
      onSelectCategory
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

    const budgeted = selectedCategory
      ? selectedCategory.budgeted
      : sumByProp("budgeted")(categories);
    const spent = selectedCategory
      ? -selectedCategory.activity
      : -sumByProp("activity")(categories);
    const available = selectedCategory
      ? selectedCategory.balance
      : sumByProp("balance")(categories);

    return (
      <Fragment>
        <TopSection>
          <TopNumbers
            numbers={[
              { label: "budgeted", value: budgeted },
              { label: "spent", value: spent },
              { label: "available", value: available }
            ]}
          />
        </TopSection>
        <ProgressSection
          budgetId={budgetId}
          currentMonth={currentMonth}
          transactions={transactionsInCategory || transactionsInGroup}
          total={spent + available}
        />
        <CategoryBreakdown
          budgetId={budgetId}
          categoriesById={categoriesById}
          selectedCategoryId={selectedCategoryId}
          transactions={transactionsInGroupForMonth}
          onSelectCategory={onSelectCategory}
        />
        <Transactions
          budgetId={budgetId}
          payeesById={payeesById}
          transactions={
            transactionsInCategoryForMonth || transactionsInGroupForMonth
          }
          linkToPayee
        />
      </Fragment>
    );
  }
}

export default CurrentMonthCategoryGroupBody;
