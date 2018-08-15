import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import { getTransactionMonth } from "../budgetUtils";
import { getFirstMonth } from "../budgetUtils";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

class Group extends PureComponent {
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
    }).isRequired,
    selectedCategoryIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    selectedMonth: PropTypes.string
  };

  render() {
    const {
      budget,
      categoryGroup,
      selectedMonth,
      selectedCategoryIds,
      onSelectMonth,
      onSelectCategory
    } = this.props;
    const {
      transactions,
      categories,
      categoriesById,
      payeesById,
      id: budgetId
    } = budget;
    const firstMonth = getFirstMonth(budget);

    const categoriesInGroup = categories.filter(
      category => category.category_group_id === categoryGroup.id
    );
    const categoryIds = categoriesInGroup.map(category => category.id);
    const transactionsInGroup = transactions.filter(transaction =>
      categoryIds.includes(transaction.category_id)
    );
    const transactionsInSelectedMonth =
      selectedMonth &&
      compose([
        sortBy("amount"),
        transactions =>
          transactions.filter(
            transaction => getTransactionMonth(transaction) === selectedMonth
          )
      ])(transactionsInGroup);

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
          transactions={transactionsInGroup}
          onSelectMonth={onSelectMonth}
          highlightFunction={
            selectedCategoryIds.length ? (transaction => selectedCategoryIds.includes(transaction.category_id)) : null
          }
        />
        <GenericEntitiesSection
          key={`categories-${selectedMonth || "all"}`}
          entityKey="category_id"
          entitiesById={categoriesById}
          linkFunction={categoryId =>
            makeLink(pages.category.path, {
              budgetId,
              categoryGroupId: categoryGroup.id,
              categoryId
            })
          }
          title={
            selectedMonth
              ? `Categories for ${moment(selectedMonth).format("MMMM")}`
              : "Categories"
          }
          transactions={transactionsInSelectedMonth || transactionsInGroup}
          showTransactionCount={false}
          selectedEntityIds={selectedCategoryIds}
          onClickEntity={onSelectCategory}
          limitShowing
        />
        {selectedMonth && (
          <TransactionsByMonthSection
            key={`transactions-${selectedMonth}`}
            categoriesById={categoriesById}
            payeesById={payeesById}
            selectedMonth={selectedMonth}
            transactions={transactionsInSelectedMonth}
          />
        )}
        <GenericEntitiesSection
          key={`payees-${selectedMonth || "all"}`}
          entityKey="payee_id"
          entitiesById={payeesById}
          linkFunction={payeeId =>
            makeLink(pages.groupPayee.path, {
              budgetId,
              categoryGroupId: categoryGroup.id,
              payeeId
            })
          }
          title={
            selectedMonth
              ? `Payees for ${moment(selectedMonth).format("MMMM")}`
              : "Payees"
          }
          transactions={transactionsInSelectedMonth || transactionsInGroup}
          limitShowing
        />
      </Fragment>
    );
  }
}

export default Group;
