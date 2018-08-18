import { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getSetting, setSetting } from "../uiRepo";
import { getFirstMonth } from "../budgetUtils";

const getMonths = (firstMonth, lastMonth) => {
  const months = [firstMonth];
  let m = firstMonth;

  while (m !== lastMonth) {
    m = moment(m)
      .add(1, "months")
      .format("YYYY-MM");
    months.push(m);
  }

  return months;
};

class CategoriesState extends Component {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(PropTypes.object).isRequired
    }).isRequired,
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super();

    this.state = {
      excludeFirstMonth: getSetting("excludeFirstMonth", props.budget.id),
      excludeLastMonth: getSetting("excludeLastMonth", props.budget.id)
    };
  }

  handleSetExclusion = ({ month, exclude }) => {
    const setting =
      month === "first" ? "excludeFirstMonth" : "excludeLastMonth";
    this.setState(
      {
        [setting]: exclude
      },
      () => {
        setSetting(setting, this.props.budget.id, this.state[setting]);
      }
    );
  };

  render() {
    const { budget } = this.props;
    const { excludeFirstMonth, excludeLastMonth } = this.state;

    const firstBudgetMonth = getFirstMonth(budget);
    const firstMonth = excludeFirstMonth
      ? moment(firstBudgetMonth)
          .add(1, "months")
          .format("YYYY-MM")
      : firstBudgetMonth;
    const lastMonth = excludeLastMonth
      ? moment()
          .subtract(1, "months")
          .format("YYYY-MM")
      : moment().format("YYYY-MM");
    const months = getMonths(firstMonth, lastMonth);

    return this.props.children({
      ...this.state,
      months,
      onSetExclusion: this.handleSetExclusion
    });
  }
}

export default CategoriesState;
