import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { getSetting, setSetting, SPENDING_MONTHS_TO_COMPARE } from "../uiRepo";
import CollapsibleSection from "./CollapsibleSection";
import SpendingChart from "./SpendingChart";
import ChartSettingsModal from "./ChartSettingsModal";

const MAX_MONTHS = 12;

class ProgressSection extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired,
    title: PropTypes.string,
    total: PropTypes.number
  };

  static defaultProps = { title: "Overview" };

  constructor(props) {
    super();

    this.state = {
      modalOpen: false,
      monthsToCompare: getSetting(SPENDING_MONTHS_TO_COMPARE, props.budgetId)
    };
  }

  handleClickSettings = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  handleDecrementMonths = () => {
    this.setState(
      state => ({
        ...state,
        monthsToCompare: Math.max(state.monthsToCompare - 1, 0)
      }),
      this.saveSetting
    );
  };

  handleIncrementMonths = () => {
    this.setState(
      state => ({
        ...state,
        monthsToCompare: Math.min(state.monthsToCompare + 1, MAX_MONTHS)
      }),
      this.saveSetting
    );
  };

  saveSetting = () => {
    setSetting(
      SPENDING_MONTHS_TO_COMPARE,
      this.props.budgetId,
      this.state.monthsToCompare
    );
  };

  render() {
    const { transactions, budgetId, currentMonth, title, total } = this.props;
    const { modalOpen, monthsToCompare } = this.state;

    return (
      <Fragment>
        <CollapsibleSection
          title={title}
          hasSettings
          onClickSettings={this.handleClickSettings}
        >
          <SpendingChart
            transactions={transactions}
            budgetId={budgetId}
            currentMonth={currentMonth}
            monthsToCompare={monthsToCompare}
            total={total}
          />
        </CollapsibleSection>
        <ChartSettingsModal
          open={modalOpen}
          monthsToCompare={monthsToCompare}
          onClose={this.handleCloseModal}
          onDecrementMonths={this.handleDecrementMonths}
          onIncrementMonths={this.handleIncrementMonths}
        />
      </Fragment>
    );
  }
}

export default ProgressSection;
