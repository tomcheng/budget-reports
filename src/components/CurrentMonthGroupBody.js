import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { getTransactionMonth } from "../utils";
import { sumByProp } from "../optimized";
import pages, { makeLink } from "../pages";
import DayByDaySection from "./DayByDaySection";
import GenericEntitiesSection from "./GenericEntitiesSection";
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
    categoryId: PropTypes.string
  };

  render() {
    const { budget, categoryGroupId, currentMonth, categoryId } = this.props;
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
    const category = categoryId && categoriesById[categoryId];
    const categoryIds = categories.map(category => category.id);
    const transactionsInCategory =
      categoryId &&
      allTransactions.filter(
        transaction => transaction.categoryId === categoryId
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

    const spent = category
      ? -category.activity
      : -sumByProp("activity")(categories);
    const available = category
      ? category.balance
      : sumByProp("balance")(categories);

    return (
      <Fragment>
        <DayByDaySection
          key={category ? category.name : "day-by-day"}
          budgetId={budgetId}
          currentMonth={currentMonth}
          title="Day by Day"
          transactions={transactionsInCategory || transactionsInGroup}
          total={spent + available}
        />
        {!category && (
          <GenericEntitiesSection
            entityKey="categoryId"
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
          />
        )}
        <TransactionsSection
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

export default CurrentMonthGroupBody;
