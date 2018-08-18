import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getTransactionMonth, sanitizeName } from "../budgetUtils";
import { getSetting, setSetting } from "../uiRepo";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

class Groups extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    excludeFirstMonth: PropTypes.bool.isRequired,
    excludeLastMonth: PropTypes.bool.isRequired,
    months: PropTypes.arrayOf(PropTypes.string).isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelectGroup: PropTypes.func.isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    onSetExclusion: PropTypes.func.isRequired,
    selectedGroupId: PropTypes.string,
    selectedMonth: PropTypes.string
  };

  constructor(props) {
    super();
    this.state = {
      showAverage: getSetting("trendsShowAverage", props.budget.id)
    };
  }

  handleToggleGroupAverage = () => {
    this.setState(
      state => ({ ...state, showAverage: !state.showAverage }),
      () => {
        setSetting(
          "trendsShowAverage",
          this.props.budget.id,
          this.state.showAverage
        );
      }
    );
  };

  render() {
    const {
      budget,
      excludeFirstMonth,
      excludeLastMonth,
      months,
      transactions,
      selectedMonth,
      selectedGroupId,
      onSelectGroup,
      onSelectMonth,
      onSetExclusion
    } = this.props;
    const { showAverage } = this.state;
    const { categoryGroupsById, categoriesById, id: budgetId } = budget;
    const selectedGroup =
      selectedGroupId && categoryGroupsById[selectedGroupId];
    const filteredTransactions = transactions.filter(t => t);

    const transactionsForMonth =
      selectedMonth &&
      filteredTransactions.filter(
        transaction => getTransactionMonth(transaction) === selectedMonth
      );

    return (
      <Fragment>
        <MonthByMonthSection
          excludeFirstMonth={excludeFirstMonth}
          excludeLastMonth={excludeLastMonth}
          highlightFunction={
            selectedGroupId &&
            (transaction =>
              categoriesById[transaction.category_id].category_group_id ===
              selectedGroupId)
          }
          months={months}
          selectedMonth={selectedMonth}
          title={
            selectedGroup
              ? `Month by Month: ${sanitizeName(selectedGroup.name)}`
              : "Month by Month"
          }
          transactions={filteredTransactions}
          onSelectMonth={onSelectMonth}
          onSetExclusion={onSetExclusion}
        />
        <GenericEntitiesSection
          key={selectedMonth || "all"}
          entityFunction={transaction =>
            categoriesById[transaction.category_id].category_group_id
          }
          entityKey="category_group_id"
          entitiesById={categoryGroupsById}
          linkFunction={categoryGroupId =>
            makeLink(pages.group.path, { budgetId, categoryGroupId })
          }
          selectedEntityId={selectedGroupId}
          title={
            selectedMonth
              ? `Category Groups: ${moment(selectedMonth).format("MMMM")}`
              : "Category Groups"
          }
          transactions={transactionsForMonth || filteredTransactions}
          onClickEntity={onSelectGroup}
          numMonths={months.length}
          showAverageToggle={!selectedMonth}
          showAverage={showAverage && !selectedMonth}
          onToggleAverage={this.handleToggleGroupAverage}
          limitShowing
        />
      </Fragment>
    );
  }
}

export default Groups;
