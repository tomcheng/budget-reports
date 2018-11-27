import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import chunk from "lodash/fp/chunk";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import head from "lodash/fp/head";
import map from "lodash/fp/map";
import pick from "lodash/fp/pick";
import range from "lodash/fp/range";
import { simpleMemoize, keyByProp } from "../dataUtils";
import { selectedPlotBandColor } from "../styleVariables";
import {
  getMortgageRate,
  getReturnOnInvestments,
  getAverageContribution,
  getCurrentInvestments,
  getAverageExpensesWithoutMortgage,
  getProjection,
  getProjectionWithRetirement
} from "../projectionUtils";
import PageLayout from "./PageLayout";
import Icon from "./Icon";
import CollapsibleSection from "./CollapsibleSection";
import ProjectionsChart from "./ProjectionsChart";
import ProjectionsSlider from "./ProjectionsSlider";
import ChartNumbers from "./ChartNumbers";

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

const adjustableEntriesByName = keyByProp("name")(adjustableEntries);

const getInitialState = simpleMemoize(
  (budget, investmentAccounts, mortgageAccounts) => {
    const {
      paymentsLeft: remainingMortgagePayments,
      mortgagePayment,
      principalProjection: mortgageProjection
    } = getMortgageRate(budget, mortgageAccounts) || {};
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
      maxAverageExpenses: Math.ceil((averageExpenses * 2) / 1000) * 1000,
      maxAverageContribution: Math.ceil((averageContribution * 2) / 1000) * 1000
    };
  }
);

class ProjectionsPage extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.array.isRequired
    }).isRequired,
    historyAction: PropTypes.string.isRequired,
    investmentAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
    location: PropTypes.string.isRequired,
    mortgageAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
    sidebarTrigger: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

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

  handleClearSelection = () => {
    this.setState({ adjustingName: null });
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
    const { historyAction, location, sidebarTrigger, title } = this.props;
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
      <PageLayout
        historyAction={historyAction}
        location={location}
        sidebarTrigger={sidebarTrigger}
        title={title}
        content={
          <Fragment>
            <CollapsibleSection title="Projection">
              <ChartNumbers
                numbers={[
                  {
                    amount: -amountNeededToRetire,
                    label: "needed for retirement",
                    decimalsToRound: 0
                  },
                  {
                    amount: -yearsUntilRetirement,
                    label: "years to retirement",
                    isMoney: false,
                    decimalsToRound: 1
                  }
                ]}
              />
              <ProjectionsChart
                investmentsProjection={projectionByYear}
                mortgageProjection={mortgageProjectionByYear}
                amountNeededToRetire={amountNeededToRetire}
                yearsUntilRetirement={yearsUntilRetirement}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Assumptions">
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
              onBlur={this.handleClearSelection}
              formatter={get([adjustingName, "formatter"])(
                adjustableEntriesByName
              )}
              value={this.state[adjustingName]}
              rangeOptions={nameToRangeOptions[adjustingName]}
            />
          </Fragment>
        }
      />
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
  <Entry
    label={label}
    value={value}
    formatter={formatter}
    onClick={() => {
      onSelect(name);
    }}
    highlightValue={isAdjusting}
    isAdjustable
  />
);

const Entry = ({
  label,
  value,
  onClick,
  highlightValue,
  isAdjustable,
  formatter = a => a
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "2px 0"
    }}
  >
    {label}:
    <div style={{ display: "flex", alignItems: "center" }} onClick={onClick}>
      <strong
        style={{
          backgroundColor: highlightValue ? selectedPlotBandColor : null,
          padding: isAdjustable && "0 4px",
          borderRadius: 2
        }}
      >
        {formatter(value)}
      </strong>
      {isAdjustable && <Icon icon="pencil" faded style={{ marginLeft: 4 }} />}
    </div>
  </div>
);

export default ProjectionsPage;
