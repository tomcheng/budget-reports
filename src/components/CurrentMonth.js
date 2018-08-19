import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import takeWhile from "lodash/fp/takeWhile";
import {
  getTransactionMonth,
  isTransfer,
  isStartingBalanceOrReconciliation,
  isIncome
} from "../budgetUtils";
import { notAny } from "../dataUtils";
import pages, { makeLink } from "../pages";
import DayByDaySection from "./DayByDaySection";
import GenericEntitiesSection from "./GenericEntitiesSection";

class CurrentMonth extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    currentMonth: PropTypes.string.isRequired,
    investmentAccounts: PropTypes.object.isRequired
  };

  state = { selectedGroupId: null };

  handleSelectGroup = groupId => {
    this.setState(state => ({
      ...state,
      selectedGroupId: state.selectedGroupId === groupId ? null : groupId
    }));
  };

  render() {
    const { budget, currentMonth, investmentAccounts } = this.props;
    const { selectedGroupId } = this.state;
    const { categoryGroupsById, categoriesById, id: budgetId } = budget;

    const transactions = budget.transactions.filter(
      notAny([
        isIncome(budget),
        isTransfer(investmentAccounts),
        isStartingBalanceOrReconciliation(budget)
      ])
    );
    const transactionsThisMonth = takeWhile(
      transaction => getTransactionMonth(transaction) === currentMonth
    )(transactions);

    return (
      <Fragment>
        <DayByDaySection
          budgetId={budget.id}
          currentMonth={currentMonth}
          transactions={transactions}
          highlightFunction={
            selectedGroupId &&
            (transaction =>
              categoriesById[transaction.category_id].category_group_id ===
              selectedGroupId)
          }
        />
        <GenericEntitiesSection
          entitiesById={categoryGroupsById}
          entityFunction={transaction =>
            categoriesById[transaction.category_id].category_group_id
          }
          linkFunction={groupId =>
            makeLink(pages.currentMonthGroup.path, {
              budgetId,
              categoryGroupId: groupId
            })
          }
          selectedEntityId={selectedGroupId}
          title="Category Groups"
          transactions={transactionsThisMonth}
          showTransactionCount
          onClickEntity={this.handleSelectGroup}
        />
      </Fragment>
    );
  }
}

export default CurrentMonth;
