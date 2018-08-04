import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { getSetting, setSetting, SPENDING_MONTHS_TO_COMPARE } from "../uiRepo";
import Section, { Subsection } from "./Section";
import TopNumbers from "./TopNumbers";
import SpendingChart from "./SpendingChart";
import ChartSettingsModal from "./ChartSettingsModal";

const MAX_MONTHS = 12;

class ProgressSection extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired,
    total: PropTypes.number,
    topNumbers: PropTypes.array
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
    const {
      transactions,
      budgetId,
      currentMonth,
      title,
      total,
      topNumbers
    } = this.props;
    const { modalOpen, monthsToCompare } = this.state;

    return (
      <Fragment>
        <Section
          title={title}
          hasSettings
          onClickSettings={this.handleClickSettings}
        >
          {topNumbers && (
            <Subsection>
              <TopNumbers numbers={topNumbers} />
            </Subsection>
          )}
          <Subsection>
            <SpendingChart
              transactions={transactions}
              budgetId={budgetId}
              currentMonth={currentMonth}
              monthsToCompare={monthsToCompare}
              total={total}
            />
          </Subsection>
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
