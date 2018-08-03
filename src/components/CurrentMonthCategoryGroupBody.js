import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
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
    currentMonth: PropTypes.string.isRequired
  };

  render() {
    const { budget, categoryGroupId, currentMonth } = this.props;
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
    const categoryIds = categories.map(category => category.id);
    const transactionsInGroup = allTransactions.filter(transaction =>
      categoryIds.includes(transaction.categoryId)
    );
    const transactionsForMonth = transactionsInGroup.filter(
      transaction => transaction.date.slice(0, 7) === currentMonth
    );

    const budgeted = sumByProp("budgeted")(categories);
    const spent = -sumByProp("activity")(categories);
    const available = sumByProp("balance")(categories);

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
          transactions={transactionsInGroup}
          total={spent + available}
        />
        <CategoryBreakdown
          budgetId={budgetId}
          categoriesById={categoriesById}
          transactions={transactionsForMonth}
        />
        <Transactions
          budgetId={budgetId}
          payeesById={payeesById}
          transactions={transactionsForMonth}
          linkToPayee
        />
      </Fragment>
    );
  }
}

export default CurrentMonthCategoryGroupBody;
