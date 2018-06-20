import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  getMortgageRate,
  getReturnOnInvestments,
  getAverageContribution,
  getCurrentInvestments,
  getAverageExpensesWithoutMortgage,
  getProjection
} from "../projectionUtils";
import Section from "./Section";

const getInitialState = budget => {
  const {
    paymentsLeft: remainingMortgagePayments,
    mortgagePayment
  } = getMortgageRate(budget);
  const returnOnInvestments = getReturnOnInvestments(budget);
  const averageContribution = getAverageContribution(budget);
  const currentInvestments = getCurrentInvestments(budget);
  const averageExpenses = getAverageExpensesWithoutMortgage(budget);

  return {
    mortgagePayment,
    remainingMortgagePayments,
    returnOnInvestments,
    averageContribution,
    currentInvestments,
    averageExpenses,
    retirementReturns: 0.04,
    maxAverageExpenses: Math.ceil(averageExpenses * 2 / 1000) * 1000,
    maxAverageContribution: Math.ceil(averageContribution * 2 / 1000) * 1000
  };
};

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

  render() {
    const {
      mortgagePayment,
      remainingMortgagePayments,
      returnOnInvestments,
      averageContribution,
      currentInvestments,
      averageExpenses,
      retirementReturns,
      maxAverageExpenses,
      maxAverageContribution
    } = this.state;

    const projection = getProjection({
      numMonths: 30 * 12,
      returnOnInvestments,
      averageContribution,
      currentInvestments
    });
    const monthlyRetirementReturn = (1 + retirementReturns) ** (1 / 12) - 1;
    let m = 0;

    while (m < projection.length) {
      if (m <= remainingMortgagePayments) {
        const remainingMortgage =
          mortgagePayment * (remainingMortgagePayments - m);
        if (
          (projection[m] - remainingMortgage) * monthlyRetirementReturn >
          averageExpenses
        ) {
          break;
        }
      } else {
        if (projection[m] * monthlyRetirementReturn > averageExpenses) {
          break;
        }
      }
      m += 1;
    }

    const yearsUntilRetirement = m / 12;

    return (
      <Section>
        <div>Current Investments: {currentInvestments.toFixed(2)}</div>
        <div>
          Average return on investments:{" "}
          {(returnOnInvestments * 100).toFixed(2)}
        </div>
        <div>
          <input
            type="range"
            value={returnOnInvestments}
            name="returnOnInvestments"
            onChange={this.handleChange}
            min={0.001}
            max={0.2}
            step={0.001}
          />
        </div>
        <div>
          Average monthly contribution: {averageContribution.toFixed(2)}
        </div>
        <div>
          <input
            type="range"
            value={averageContribution}
            name="averageContribution"
            onChange={this.handleChange}
            min={1}
            max={maxAverageContribution}
          />
        </div>
        <div>Mortgage payment: {mortgagePayment.toFixed(2)}</div>
        <div>
          Years remaining on mortgage:{" "}
          {(remainingMortgagePayments / 12).toFixed(1)}
        </div>
        <div>
          Average expenses without mortgage: {averageExpenses.toFixed(2)}
        </div>
        <div>
          <input
            type="range"
            value={averageExpenses}
            name="averageExpenses"
            onChange={this.handleChange}
            min={1}
            max={maxAverageExpenses}
          />
        </div>
        <div>Years until retirement: {yearsUntilRetirement.toFixed(1)}</div>
      </Section>
    );
  }
}

export default ProjectionsBody;
