import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import MonthByMonthSection from "./MonthByMonthSection";

class Income extends PureComponent {
  static propTypes = {
    excludeFirstMonth: PropTypes.bool.isRequired,
    excludeLastMonth: PropTypes.bool.isRequired,
    onSetExclusion: PropTypes.func.isRequired,
    months: PropTypes.array.isRequired,
    transactions: PropTypes.array.isRequired
  };

  state = {
    selectedMonth: null
  };

  handleSelectMonth = month => {
    this.setState(state => ({
      selectedMonth: month === state.selectedMonth ? null : month
    }));
  };

  render() {
    const {
      excludeFirstMonth,
      excludeLastMonth,
      months,
      transactions,
      onSetExclusion
    } = this.props;
    const { selectedMonth } = this.state;

    return (
      <MonthByMonthSection
        excludeFirstMonth={excludeFirstMonth}
        excludeLastMonth={excludeLastMonth}
        months={months}
        selectedMonth={selectedMonth}
        title="Month by Month"
        transactions={transactions}
        onSelectMonth={this.handleSelectMonth}
        onSetExclusion={onSetExclusion}
      />
    );
  }
}

export default Income;
