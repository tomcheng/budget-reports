import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getSetting, SPENDING_MONTHS_TO_COMPARE } from "../uiRepo";
import Section from "./Section";
import SpendingChart from "./SpendingChart";
import ChartSettingsModal from "./ChartSettingsModal";

class CurrentMonthOverview extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired
  };

  constructor(props) {
    super();

    this.state = {
      modalOpen: true,
      monthsToCompare: getSetting(SPENDING_MONTHS_TO_COMPARE, props.budgetId)
    };
  }

  handleClickSettings = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const { transactions, budgetId, currentMonth } = this.props;
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
          />
        </Section>
        <ChartSettingsModal
          open={modalOpen}
          onClose={this.handleCloseModal}
          monthsToCompare={monthsToCompare}
        />
      </Fragment>
    );
  }
}

export default CurrentMonthOverview;
