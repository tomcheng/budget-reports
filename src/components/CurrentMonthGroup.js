import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { getTransactionMonth } from "../budgetUtils";
import { sumByProp } from "../optimized";
import pages, { makeLink } from "../pages";
import DayByDaySection from "./DayByDaySection";
import GenericEntitiesSection from "./GenericEntitiesSection";
import TransactionsSection from "./TransactionsSection";

class CurrentMonthGroup extends PureComponent {
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
      category => category.category_group_id === categoryGroupId
    );
    const categoryIds = categories.map(category => category.id);
    const transactionsInGroup = allTransactions.filter(transaction =>
      categoryIds.includes(transaction.category_id)
    );
    const transactionsInGroupForMonth = transactionsInGroup.filter(
      transaction => getTransactionMonth(transaction) === currentMonth
    );

    const spent = -sumByProp("activity")(categories);
    const available = sumByProp("balance")(categories);

    return (
      <Fragment>
        <DayByDaySection
          budgetId={budgetId}
          currentMonth={currentMonth}
          title="Day by Day"
          transactions={transactionsInGroup}
          total={spent + available}
        />
        <GenericEntitiesSection
          entityKey="category_id"
          entitiesById={categoriesById}
          linkFunction={categoryId =>
            makeLink(pages.currentMonthCategory.path, {
              budgetId,
              categoryGroupId,
              categoryId
            })
          }
          title="Categories"
          transactions={transactionsInGroupForMonth}
          showTransactionCount
        />
        <TransactionsSection
          categoriesById={categoriesById}
          payeesById={payeesById}
          transactions={transactionsInGroupForMonth}
        />
      </Fragment>
    );
  }
}

export default CurrentMonthGroup;
