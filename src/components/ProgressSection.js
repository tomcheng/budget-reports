import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getSetting, setSetting, SPENDING_MONTHS_TO_COMPARE } from "../uiRepo";
import Section from "./Section";
import SpendingChart from "./SpendingChart";
import ChartSettingsModal from "./ChartSettingsModal";

const MAX_MONTHS = 12;

class ProgressSection extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired,
    total: PropTypes.number
  };

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
    const { transactions, budgetId, currentMonth, total } = this.props;
    const { modalOpen, monthsToCompare } = this.state;

    return (
      <Fragment>
        <Section
          title={`Progress for ${moment(currentMonth).format("MMMM")}`}
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
        </Section>
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
