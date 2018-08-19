import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { getTransactionMonth, sanitizeName } from "../budgetUtils";
import { sumByProp } from "../dataUtils";
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

  state = { selectedCategoryId: null };

  handleSelectCategory = categoryId => {
    this.setState(state => ({
      ...state,
      selectedCategoryId:
        state.selectedCategoryId === categoryId ? null : categoryId
    }));
  };

  render() {
    const { budget, categoryGroupId, currentMonth } = this.props;
    const { selectedCategoryId } = this.state;
    const {
      id: budgetId,
      payeesById,
      categories: allCategories,
      categoriesById,
      transactions: allTransactions
    } = budget;

    const selectedCategory =
      selectedCategoryId && categoriesById[selectedCategoryId];
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
    const highlightedTransactions =
      selectedCategoryId &&
      transactionsInGroupForMonth.filter(
        transaction => transaction.category_id === selectedCategoryId
      );

    const spent = -sumByProp("activity")(categories);
    const available = sumByProp("balance")(categories);

    return (
      <Fragment>
        <DayByDaySection
          budgetId={budgetId}
          currentMonth={currentMonth}
          highlightFunction={
            selectedCategoryId &&
            (transaction => transaction.category_id === selectedCategoryId)
          }
          title={
            selectedCategory
              ? `Day by Day: ${sanitizeName(selectedCategory.name)}`
              : "Day by Day"
          }
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
          selectedEntityId={selectedCategoryId}
          title="Categories"
          transactions={transactionsInGroupForMonth}
          showTransactionCount
          onClickEntity={this.handleSelectCategory}
        />
        <TransactionsSection
          categoriesById={categoriesById}
          payeesById={payeesById}
          transactions={highlightedTransactions || transactionsInGroupForMonth}
          title={
            selectedCategory
              ? `Transactions: ${sanitizeName(selectedCategory.name)}`
              : "Transactions"
          }
        />
      </Fragment>
    );
  }
}

export default CurrentMonthGroup;
