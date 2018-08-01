import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import includes from "lodash/fp/includes";
import filter from "lodash/fp/filter";
import matchesProperty from "lodash/fp/matchesProperty";
import map from "lodash/fp/map";
import sumBy from "lodash/fp/sumBy";
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
