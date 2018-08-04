import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import chunk from "lodash/fp/chunk";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import head from "lodash/fp/head";
import keyBy from "lodash/fp/keyBy";
import map from "lodash/fp/map";
import pick from "lodash/fp/pick";
import range from "lodash/fp/range";
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
import CollapsibleSection from "./CollapsibleSection";
import ProjectionsChart from "./ProjectionsChart";
import ProjectionsSlider from "./ProjectionsSlider";

const YEARS_TO_PROJECT = 50;

const adjustableEntries = [
  {
    label: "Average monthly contribution",
    name: "averageContribution",
    formatter: val => `$${Math.round(val)}`
  },
  {
    label: "Average return on investments",
    name: "returnOnInvestments",
    formatter: val => `${(val * 100).toFixed(1)}%`
  },
  {
    label: "Average expenses without mortgage",
    name: "averageExpenses",
    formatter: val => `$${Math.round(val)}`
  },
  {
    label: "Return on investment after retirement",
    name: "retirementReturns",
    formatter: val => `${(val * 100).toFixed(1)}%`
  },
  {
    label: "Average tax rate after retirement",
    name: "retirementTaxRate",
    formatter: val => `${(val * 100).toFixed(1)}%`
  }
];

const adjustableEntriesByName = keyBy("name")(adjustableEntries);

const getInitialState = simpleMemoize(
  (budget, investmentAccounts, mortgageAccounts) => {
    const {
      paymentsLeft: remainingMortgagePayments,
      mortgagePayment,
      principalProjection: mortgageProjection
    } =
      getMortgageRate(budget, mortgageAccounts) || {};
    const returnOnInvestments = getReturnOnInvestments(
      budget,
      investmentAccounts
    );
    const averageContribution = getAverageContribution(
      budget,
      investmentAccounts
    );
    const currentInvestments = getCurrentInvestments(
      budget,
      investmentAccounts
    );
    const averageExpenses = getAverageExpensesWithoutMortgage(
      budget,
      investmentAccounts,
      mortgageAccounts
    );

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
  }
);

class ProjectionsBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.array.isRequired
    }).isRequired,
    investmentAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
    mortgageAccounts: PropTypes.objectOf(PropTypes.bool).isRequired
  };

  constructor(props) {
    super();
    this.state = {
      ...getInitialState(
        props.budget,
        props.investmentAccounts,
        props.mortgageAccounts
      ),
      adjustingName: null
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: parseFloat(e.target.value) });
  };

  handleSelectAdjusting = name => {
    this.setState(state => ({
      adjustingName: state.adjustingName === name ? null : name
    }));
  };

  handleResetCalculation = calculation => {
    const { budget, investmentAccounts, mortgageAccounts } = this.props;
    this.setState(
      pick(calculation)(
        getInitialState(budget, investmentAccounts, mortgageAccounts)
      )
    );
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
      maxAverageContribution,
      adjustingName
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
      if (m < remainingMortgagePayments) {
        const remainingMortgage = range(
          0,
          remainingMortgagePayments - m
        ).reduce(
          (acc, curr) =>
            acc +
            mortgagePayment /
              (1 + monthlyRetirementReturn * (1 - retirementTaxRate)) ** curr,
          0
        );
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
    const hasMortgage = !!mortgagePayment;

    const yearsUntilRetirement = m / 12;
    const projectionByYear = compose([map(head), chunk(12)])(
      projectionWithRetirement
    );
    const mortgageProjectionByYear = compose([map(head), chunk(12)])(
      mortgageProjection
    );

    const nameToRangeOptions = {
      averageContribution: { min: 0, max: maxAverageContribution, step: 50 },
      returnOnInvestments: { min: 0, max: 0.2, step: 0.001 },
      averageExpenses: { min: 0, max: maxAverageExpenses, step: 50 },
      retirementReturns: { min: 0, max: 0.2, step: 0.001 },
      retirementTaxRate: { min: 0, max: 0.5, step: 0.001 }
    };

    return (
      <Fragment>
        <CollapsibleSection title="Projection">
          <ProjectionsChart
            investmentsProjection={projectionByYear}
            mortgageProjection={mortgageProjectionByYear}
            amountNeededToRetire={amountNeededToRetire}
            yearsUntilRetirement={yearsUntilRetirement}
          />
        </CollapsibleSection>
        <CollapsibleSection title="Assumptions">
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
          {adjustableEntries.map(({ label, name, formatter }) => (
            <AdjustableEntry
              key={name}
              label={label}
              name={name}
              value={this.state[name]}
              formatter={formatter}
              isAdjusting={adjustingName === name}
              onSelect={this.handleSelectAdjusting}
              onReset={this.handleResetCalculation}
              onChange={this.handleChange}
            />
          ))}
          {hasMortgage && (
            <Fragment>
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
            </Fragment>
          )}
        </CollapsibleSection>
        <ProjectionsSlider
          name={adjustingName}
          label={get([adjustingName, "label"])(adjustableEntriesByName)}
          onReset={this.handleResetCalculation}
          onChange={this.handleChange}
          value={this.state[adjustingName]}
          rangeOptions={nameToRangeOptions[adjustingName]}
        />
      </Fragment>
    );
  }
}

const AdjustableEntry = ({
  label,
  value,
  formatter,
  name,
  onSelect,
  isAdjusting
}) => (
  <Fragment>
    <Entry
      label={label}
      value={value}
      formatter={formatter}
      onClick={() => {
        onSelect(name);
      }}
      highlightValue={isAdjusting}
    />
  </Fragment>
);

const Entry = ({
  label,
  value,
  onClick,
  highlightValue,
  formatter = a => a
}) => (
  <div
    style={{ display: "flex", justifyContent: "space-between" }}
    onClick={onClick}
  >
    {label}:
    <strong style={{ backgroundColor: highlightValue ? "#eee" : null }}>
      {formatter(value)}
    </strong>
  </div>
);

export default ProjectionsBody;
