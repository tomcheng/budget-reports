import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import MonthByMonthSection from "./MonthByMonthSection";
import { getTransactionMonth, sanitizeName } from "../budgetUtils";
import moment from "moment";
import GenericEntitiesSection from "./GenericEntitiesSection";

class Income extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    excludeFirstMonth: PropTypes.bool.isRequired,
    excludeLastMonth: PropTypes.bool.isRequired,
    onSetExclusion: PropTypes.func.isRequired,
    months: PropTypes.array.isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        payee_id: PropTypes.string.isRequired
      })
    ).isRequired
  };

  state = {
    selectedMonth: null,
    selectedPayeeId: null
  };

  handleSelectMonth = month => {
    this.setState(state => ({
      selectedMonth: month === state.selectedMonth ? null : month
    }));
  };

  handleSelectPayee = payeeId => {
    this.setState(state => ({
      selectedPayeeId: payeeId === state.selectedPayeeId ? null : payeeId
    }));
  };

  render() {
    const {
      budget,
      excludeFirstMonth,
      excludeLastMonth,
      months,
      transactions,
      onSetExclusion
    } = this.props;
    const { selectedMonth, selectedPayeeId } = this.state;
    const { payeesById } = budget;

    const transactionsInSelectedMonth =
      selectedMonth &&
      transactions.filter(
        transaction => getTransactionMonth(transaction) === selectedMonth
      );

    return (
      <Fragment>
        <MonthByMonthSection
          excludeFirstMonth={excludeFirstMonth}
          excludeLastMonth={excludeLastMonth}
          highlightFunction={
            selectedPayeeId &&
            (transaction => transaction.payee_id === selectedPayeeId)
          }
          months={months}
          selectedMonth={selectedMonth}
          title={
            selectedPayeeId
              ? `Month by Month: ${sanitizeName(
                  payeesById[selectedPayeeId].name
                )}`
              : "Month by Month"
          }
          transactions={transactions}
          onSelectMonth={this.handleSelectMonth}
          onSetExclusion={onSetExclusion}
        />
        <GenericEntitiesSection
          key={`payee-${selectedMonth || "all"}`}
          entityKey="payee_id"
          entitiesById={payeesById}
          title={
            selectedMonth
              ? `Payees: ${moment(selectedMonth).format("MMMM")}`
              : "Payees"
          }
          transactions={transactionsInSelectedMonth || transactions}
          selectedEntityId={selectedPayeeId}
          onClickEntity={this.handleSelectPayee}
          showAverageToggle={false}
          showAverage={!selectedMonth}
          numMonths={months.length}
          limitShowing
        />
      </Fragment>
    );
  }
}

export default Income;
