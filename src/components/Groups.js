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
    selectedMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectGroup: PropTypes.func.isRequired,
    onSelectMonth: PropTypes.func.isRequired
  };

  render() {
    const {
      budget,
      investmentAccounts,
      selectedMonths,
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

    const transactionsForSelectedMonths =
      selectedMonths.length > 0 &&
      filteredTransactions.filter(transaction =>
        selectedMonths.includes(getTransactionMonth(transaction))
      );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonths={selectedMonths}
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
            selectedMonths.length === 1
              ? `Category Groups for ${moment(selectedMonths[0]).format(
                  "MMMM"
                )}`
              : selectedMonths.length > 1
                ? `Category Groups for ${selectedMonths.length} Months`
                : "Category Groups"
          }
          transactions={transactionsForSelectedMonths || filteredTransactions}
          onClickEntity={onSelectGroup}
        />
      </Fragment>
    );
  }
}

export default Groups;
