import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import { getTransactionMonth, getFirstMonth } from "../utils";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
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
    onSelectMonth: PropTypes.func.isRequired,
    selectedMonth: PropTypes.string
  };

  render() {
    const { budget, categoryGroup, selectedMonth, onSelectMonth } = this.props;
    const {
      transactions,
      categories,
      categoriesById,
      payeesById,
      id: budgetId
    } = budget;
    const firstMonth = getFirstMonth(budget);

    const categoriesInGroup = categories.filter(
      category => category.categoryGroupId === categoryGroup.id
    );
    const categoryIds = categoriesInGroup.map(category => category.id);
    const transactionsInGroup = transactions.filter(transaction =>
      categoryIds.includes(transaction.categoryId)
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
        />
        <GenericEntitiesSection
          entityKey="categoryId"
          entitiesById={categoriesById}
          linkFunction={categoryId =>
            makeLink(pages.category.path, {
              budgetId,
              categoryGroupId: categoryGroup.id,
              categoryId
            })
          }
          title="Categories"
          transactions={transactionsInSelectedMonth || transactionsInGroup}
          showTransactionCount={false}
        />
        <GenericEntitiesSection
          entityKey="payeeId"
          entitiesById={payeesById}
          linkFunction={payeeId =>
            makeLink(pages.groupPayee.path, {
              budgetId,
              categoryGroupId: categoryGroup.id,
              payeeId
            })
          }
          title="Payees"
          transactions={transactionsInSelectedMonth || transactionsInGroup}
          showTransactionCount
        />
      </Fragment>
    );
  }
}

export default Group;
