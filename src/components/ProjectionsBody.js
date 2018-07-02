import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import chunk from "lodash/fp/chunk";
import compose from "lodash/fp/compose";
import head from "lodash/fp/head";
import map from "lodash/fp/map";
import pick from "lodash/fp/pick";
import { simpleMemoize } from "../utils";
import {
  getMortgageRate,
  getReturnOnInvestments,
  getAverageContribution,
  getCurrentInvestments,
  getAverageExpensesWithoutMortgage,
  getProjection,
  getProjectionWithRetirement
} from "../projectionUtils";
import Section from "./Section";
import ProjectionsChart from "./ProjectionsChart";

const YEARS_TO_PROJECT = 50;

const getInitialState = simpleMemoize(budget => {
  const {
    paymentsLeft: remainingMortgagePayments,
    mortgagePayment,
    principalProjection: mortgageProjection
  } = getMortgageRate(budget);
  const returnOnInvestments = getReturnOnInvestments(budget);
  const averageContribution = getAverageContribution(budget);
  const currentInvestments = getCurrentInvestments(budget);
  const averageExpenses = getAverageExpensesWithoutMortgage(budget);

  return {
    mortgagePayment,
    remainingMortgagePayments,
    mortgageProjection,
    returnOnInvestments,
    averageContribution,
    currentInvestments,
    averageExpenses,
    retirementReturns: 0.04,
    retirementTaxRate: 0.15,
    maxAverageExpenses: Math.ceil(averageExpenses * 2 / 1000) * 1000,
    maxAverageContribution: Math.ceil(averageContribution * 2 / 1000) * 1000
  };
});

class ProjectionsBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.array.isRequired
    }).isRequired
  };

  constructor(props) {
    super();
    this.state = getInitialState(props.budget);
  }

  handleChange = e => {
    this.setState({ [e.target.name]: parseFloat(e.target.value) });
  };

  handleResetCalculation = calculation => {
    const { budget } = this.props;
    this.setState(pick(calculation)(getInitialState(budget)));
  };

  render() {
    const {
      mortgagePayment,
      remainingMortgagePayments,
      mortgageProjection,
      returnOnInvestments,
      averageContribution,
      currentInvestments,
      averageExpenses,
      retirementReturns,
      retirementTaxRate,
      maxAverageExpenses,
      maxAverageContribution
    } = this.state;

    const projection = getProjection({
      numMonths: YEARS_TO_PROJECT * 12,
      returnOnInvestments,
      averageContribution,
      currentInvestments
    });
    const monthlyRetirementReturn = (1 + retirementReturns) ** (1 / 12) - 1;
    const amountNeededToRetire =
      averageExpenses / (monthlyRetirementReturn * (1 - retirementTaxRate));
    let m = 0;

    while (m < projection.length) {
      if (m <= remainingMortgagePayments) {
        const remainingMortgage =
          mortgagePayment * (remainingMortgagePayments - m);
        if (
          (projection[m] - remainingMortgage) *
            monthlyRetirementReturn *
            (1 - retirementTaxRate) >
          averageExpenses
        ) {
          break;
        }
      } else {
        if (
          projection[m] * monthlyRetirementReturn * (1 - retirementTaxRate) >
          averageExpenses
        ) {
          break;
        }
      }
      m += 1;
    }

    const projectionWithRetirement = getProjectionWithRetirement({
      numMonths: YEARS_TO_PROJECT * 12,
      returnOnInvestments,
      averageContribution,
      currentInvestments,
      monthsBeforeRetirement: m,
      monthlyExpenses: averageExpenses,
      retirementReturns,
      retirementTaxRate,
      remainingMortgagePayments,
      mortgagePayment
    });

    const yearsUntilRetirement = m / 12;
    const projectionByYear = compose([map(head), chunk(12)])(
      projectionWithRetirement
    );
    const mortgageProjectionByYear = compose([map(head), chunk(12)])(
      mortgageProjection
    );

    return (
      <Fragment>
        <ProjectionsChart
          investmentsProjection={projectionByYear}
          mortgageProjection={mortgageProjectionByYear}
          amountNeededToRetire={amountNeededToRetire}
          yearsUntilRetirement={yearsUntilRetirement}
        />
        <Section>
          <Entry
            label="Earliest you can retire"
            value={yearsUntilRetirement}
            formatter={val => `${val.toFixed(1)} years`}
          />
          <Entry
            label="Amount needed for retirement"
            value={amountNeededToRetire}
            formatter={val => `$${Math.round(val)}`}
          />
          <AdjustableEntry
            label="Average monthly contribution"
            value={averageContribution}
            formatter={val => `$${Math.round(val)}`}
            onReset={this.handleResetCalculation}
            name="averageContribution"
            onChange={this.handleChange}
            min={0}
            max={maxAverageContribution}
            step={10}
          />
          <AdjustableEntry
            label="Average return on investments"
            value={returnOnInvestments}
            formatter={val => `${(val * 100).toFixed(1)}%`}
            onReset={this.handleResetCalculation}
            name="returnOnInvestments"
            onChange={this.handleChange}
            min={0}
            max={0.2}
            step={0.001}
          />
          <Entry
            label="Mortgage payment"
            value={mortgagePayment}
            formatter={val => `$${val.toFixed(2)}`}
          />
          <Entry
            label="Time remaining on mortgage"
            value={remainingMortgagePayments}
            formatter={val => `${(val / 12).toFixed(1)} years`}
          />
          <AdjustableEntry
            label="Average expenses without mortgage"
            value={averageExpenses}
            formatter={val => `$${Math.round(val)}`}
            onReset={this.handleResetCalculation}
            name="averageExpenses"
            onChange={this.handleChange}
            min={0}
            max={maxAverageExpenses}
            step={10}
          />
          <AdjustableEntry
            label="Return on investment after retirement"
            value={retirementReturns}
            formatter={val => `${(val * 100).toFixed(1)}%`}
            onReset={this.handleResetCalculation}
            name="retirementReturns"
            onChange={this.handleChange}
            min={0}
            max={0.2}
            step={0.001}
          />
          <AdjustableEntry
            label="Average tax rate after retirement"
            value={retirementTaxRate}
            formatter={val => `${(val * 100).toFixed(1)}%`}
            onReset={this.handleResetCalculation}
            name="retirementTaxRate"
            onChange={this.handleChange}
            min={0}
            max={0.5}
            step={0.001}
          />
        </Section>
      </Fragment>
    );
  }
}

const AdjustableEntry = ({ label, value, formatter, ...other }) => (
  <Fragment>
    <Entry label={label} value={value} formatter={formatter} />
    <Range {...other} value={value} />
  </Fragment>
);

const Entry = ({ label, value, formatter = a => a }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    {label}:
    <strong>{formatter(value)}</strong>
  </div>
);

const Range = ({ name, onReset, ...other }) => (
  <Fragment>
    <input
      {...other}
      name={name}
      type="range"
      style={{ display: "block", width: "100%" }}
    />
    <div>
      <button
        onClick={() => {
          onReset(name);
        }}
      >
        reset
      </button>
    </div>
  </Fragment>
);

export default ProjectionsBody;
