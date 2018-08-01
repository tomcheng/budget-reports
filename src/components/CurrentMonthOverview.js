import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getSetting, setSetting, SPENDING_MONTHS_TO_COMPARE } from "../uiRepo";
import Section from "./Section";
import SpendingChart from "./SpendingChart";
import Modal from "./Modal";
import Form from "./Form.js";
import Field from "./Field";
import { PrimaryButton } from "./Button";

class CurrentMonthOverview extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired
  };

  state = { modalOpen: false };

  handleClickSettings = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const { transactions, budgetId, currentMonth } = this.props;
    const { modalOpen } = this.state;

    return (
      <Form
        initialValues={{
          months: getSetting(SPENDING_MONTHS_TO_COMPARE, budgetId)
        }}
      >
        {({ onChange, values }) => (
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
                monthsToCompare={values.months}
              />
            </Section>
            <Modal
              open={modalOpen}
              title="Chart Settings"
              onClose={this.handleCloseModal}
            >
              <Field
                type="range"
                label="Months to compare"
                name="months"
                onChange={args => {
                  onChange(args);
                  setSetting(SPENDING_MONTHS_TO_COMPARE, budgetId, args.value);
                }}
                value={values.months}
                min={0}
                max={12}
                step={1}
              />
              <PrimaryButton>Done</PrimaryButton>
            </Modal>
          </Fragment>
        )}
      </Form>
    );
  }
}

export default CurrentMonthOverview;
