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
            value={`${yearsUntilRetirement.toFixed(1)} years`}
          />
          <Entry
            label="Amount needed for retirement"
            value={`$${Math.round(amountNeededToRetire)}`}
          />
          <Entry
            label="Average monthly contribution"
            value={`$${Math.round(averageContribution)}`}
          />
          <Range
            onReset={this.handleResetCalculation}
            value={averageContribution}
            name="averageContribution"
            onChange={this.handleChange}
            min={0}
            max={maxAverageContribution}
            step={10}
          />
          <Entry
            label="Average return on investments"
            value={`${(returnOnInvestments * 100).toFixed(1)}%`}
          />
          <Range
            onReset={this.handleResetCalculation}
            value={returnOnInvestments}
            name="returnOnInvestments"
            onChange={this.handleChange}
            min={0}
            max={0.2}
            step={0.001}
          />
          <Entry
            label="Mortgage payment"
            value={`$${mortgagePayment.toFixed(2)}`}
          />
          <Entry
            label="Time remaining on mortgage"
            value={`${(remainingMortgagePayments / 12).toFixed(1)} years`}
          />
          <Entry
            label="Average expenses without mortgage"
            value={`$${Math.round(averageExpenses)}`}
          />
          <Range
            onReset={this.handleResetCalculation}
            value={averageExpenses}
            name="averageExpenses"
            onChange={this.handleChange}
            min={0}
            max={maxAverageExpenses}
            step={10}
          />
          <Entry
            label="Return on investment after retirement"
            value={`${(retirementReturns * 100).toFixed(1)}%`}
          />
          <Range
            onReset={this.handleResetCalculation}
            value={retirementReturns}
            name="retirementReturns"
            onChange={this.handleChange}
            min={0}
            max={0.2}
            step={0.001}
          />
          <Entry
            label="Average tax rate after retirement"
            value={`${(retirementTaxRate * 100).toFixed(1)}%`}
          />
          <Range
            onReset={this.handleResetCalculation}
            value={retirementTaxRate}
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

const Entry = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    {label}:
    <strong>{value}</strong>
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
