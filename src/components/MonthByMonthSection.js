import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getMonthsToNow, getTransactionMonth } from "../budgetUtils";
import { groupBy, sumByProp } from "../dataUtils";
import { lightPrimaryColor, lighterPrimaryColor } from "../styleVariables";
import CollapsibleSection from "./CollapsibleSection";
import ChartNumbers from "./ChartNumbers";
import MonthlyChart from "./MonthlyChart";
import MonthByMonthSettingsModal from "./MonthByMonthSettingsModal";

class MonthByMonthSection extends Component {
  static propTypes = {
    firstMonth: PropTypes.string.isRequired,
    excludeFirstMonth: PropTypes.bool.isRequired,
    excludeLastMonth: PropTypes.bool.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    onSetExclusion: PropTypes.func.isRequired,
    highlightFunction: PropTypes.func,
    selectedMonth: PropTypes.string,
    title: PropTypes.string
  };
  static defaultProps = { title: "Month by Month" };

  state = { settingsModalOpen: false };

  handleClickSettings = () => {
    this.setState({ settingsModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ settingsModalOpen: false });
  };

  render() {
    const {
      excludeFirstMonth,
      excludeLastMonth,
      firstMonth,
      highlightFunction,
      selectedMonth,
      title,
      transactions,
      onSelectMonth,
      onSetExclusion
    } = this.props;
    const { settingsModalOpen } = this.state;

    const months = getMonthsToNow(firstMonth);
    let total = 0;
    let selectedMonthTotal = 0;

    const transactionsByMonth = groupBy(getTransactionMonth)(transactions);
    const data = months.map(month => {
      const grouped = groupBy(highlightFunction || (() => false))(
        transactionsByMonth[month] || []
      );
      const amount = sumByProp("amount")(grouped.false || []);
      const highlighted = sumByProp("amount")(grouped.true || []);
      total += highlightFunction ? highlighted : amount;
      if (month === selectedMonth) {
        selectedMonthTotal = highlightFunction ? highlighted : amount;
      }

      return { month, amount: -amount, highlighted: -highlighted };
    });

    const chartNumbers = selectedMonth
      ? [
          { amount: total / months.length, label: "average" },
          {
            amount: selectedMonthTotal,
            label: moment(selectedMonth).format("MMM YYYY")
          }
        ]
      : [
          { amount: total / months.length, label: "average" },
          {
            amount: total,
            label: "total"
          }
        ];
    const series = [
      {
        color: highlightFunction ? lightPrimaryColor : lighterPrimaryColor,
        valueFunction: d => d.amount
      }
    ];

    if (highlightFunction) {
      series.push({
        color: lighterPrimaryColor,
        valueFunction: d => d.highlighted
      });
    }

    return (
      <CollapsibleSection
        title={title}
        hasSettings
        onClickSettings={this.handleClickSettings}
      >
        <ChartNumbers numbers={chartNumbers} />
        <MonthlyChart
          data={data}
          average={total / months.length}
          series={series}
          selectedMonth={selectedMonth}
          onSelectMonth={onSelectMonth}
        />
        <MonthByMonthSettingsModal
          excludeFirstMonth={excludeFirstMonth}
          excludeLastMonth={excludeLastMonth}
          open={settingsModalOpen}
          onClose={this.handleCloseModal}
          onSetExclusion={onSetExclusion}
        />
      </CollapsibleSection>
    );
  }
}

export default MonthByMonthSection;
