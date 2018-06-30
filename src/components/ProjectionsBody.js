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
  getProjection
} from "../projectionUtils";
import Section from "./Section";
import ProjectionsChart from "./ProjectionsChart";

const getInitialState = simpleMemoize(budget => {
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
    const projectionByYear = compose([map(head), chunk(12)])(projection);

    return (
      <Fragment>
        <ProjectionsChart projection={projectionByYear} />
        <Section>
          <div>Years until retirement: {yearsUntilRetirement.toFixed(1)}</div>
          <div>Current Investments: {currentInvestments.toFixed(2)}</div>
          <div>
            Average return on investments:{" "}
            {(returnOnInvestments * 100).toFixed(2)}
          </div>
          <div>
            <Range
              value={returnOnInvestments}
              name="returnOnInvestments"
              onChange={this.handleChange}
              min={0.001}
              max={0.2}
              step={0.001}
            />
          </div>
          <div>
            <button
              onClick={() => {
                this.handleResetCalculation("returnOnInvestments");
              }}
            >
              reset
            </button>
          </div>
          <div>
            Average monthly contribution: {averageContribution.toFixed(2)}
          </div>
          <div>
            <Range
              value={averageContribution}
              name="averageContribution"
              onChange={this.handleChange}
              min={1}
              max={maxAverageContribution}
            />
          </div>
          <div>
            <button
              onClick={() => {
                this.handleResetCalculation("averageContribution");
              }}
            >
              reset
            </button>
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
            <Range
              value={averageExpenses}
              name="averageExpenses"
              onChange={this.handleChange}
              min={1}
              max={maxAverageExpenses}
            />
          </div>
          <div>
            <button
              onClick={() => {
                this.handleResetCalculation("averageExpenses");
              }}
            >
              reset
            </button>
          </div>
        </Section>
      </Fragment>
    );
  }
}

const Range = props => (
  <input {...props} type="range" style={{ width: "100%" }} />
);

export default ProjectionsBody;
