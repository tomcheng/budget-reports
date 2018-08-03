import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { getTransactionMonth } from "../utils";
// import { groupByProp } from "../optimized";
import CategoryGroupMonthByMonthChart from "./CategoryGroupMonthByMonthChart";

class CategoryGroupBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          categoryId: PropTypes.string
        })
      ).isRequired,
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    categoryGroup: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const { categoryGroup, budget } = this.props;
    const { transactions, categories } = budget;

    const categoriesInGroup = categories.filter(
      category => category.categoryGroupId === categoryGroup.id
    );
    const categoryIds = categoriesInGroup.map(category => category.id);
    const transactionsInGroup = transactions.filter(transaction =>
      categoryIds.includes(transaction.categoryId)
    );
    // const transactionsByCategory = groupByProp("categoryId")(
    //   transactionsInGroup
    // );

    return (
      <CategoryGroupMonthByMonthChart
        firstMonth={getTransactionMonth(
          transactions[transactions.length - 1]
        )}
        transactions={transactionsInGroup}
      />
    );
  }
}

export default CategoryGroupBody;
