import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { notAny } from "../optimized";
import {
  getFirstMonth,
  isStartingBalanceOrReconciliation,
  isTransfer,
  isIncome,
  getTransactionMonth
} from "../budgetUtils";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

class Groups extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    investmentAccounts: PropTypes.object.isRequired,
    selectedGroupIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectGroup: PropTypes.func.isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    selectedMonth: PropTypes.string
  };

  render() {
    const {
      budget,
      investmentAccounts,
      selectedMonth,
      selectedGroupIds,
      onSelectGroup,
      onSelectMonth
    } = this.props;
    const {
      transactions,
      categoryGroupsById,
      categoriesById,
      id: budgetId
    } = budget;
    const firstMonth = getFirstMonth(budget);
    const filteredTransactions = transactions.filter(
      notAny([
        isStartingBalanceOrReconciliation(budget),
        isTransfer(investmentAccounts),
        isIncome(budget)
      ])
    );

    const transactionsForMonth =
      selectedMonth &&
      filteredTransactions.filter(
        transaction => getTransactionMonth(transaction) === selectedMonth
      );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
          highlightFunction={
            selectedGroupIds.length
              ? transaction =>
                  selectedGroupIds.includes(
                    categoriesById[transaction.category_id].category_group_id
                  )
              : null
          }
          transactions={filteredTransactions}
          onSelectMonth={onSelectMonth}
        />
        <GenericEntitiesSection
          entityFunction={transaction =>
            categoriesById[transaction.category_id].category_group_id
          }
          entitiesById={categoryGroupsById}
          linkFunction={categoryGroupId =>
            makeLink(pages.group.path, { budgetId, categoryGroupId })
          }
          showTransactionCount={false}
          selectedEntityIds={selectedGroupIds}
          title={
            selectedMonth
              ? `Category Groups for ${moment(selectedMonth).format("MMMM")}`
              : "Category Groups"
          }
          transactions={transactionsForMonth || filteredTransactions}
          onClickEntity={onSelectGroup}
        />
      </Fragment>
    );
  }
}

export default Groups;
