import { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
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

const INITIAL_STATE = {
  selectedMonth: null,
  selectedGroupId: null,
  selectedCategoryId: null,
  selectedPayeeId: null
};

class CategoriesState extends Component {
  static propTypes = {
    action: PropTypes.oneOf(["PUSH", "POP", "REPLACE"]).isRequired,
    children: PropTypes.func.isRequired,
    excludeFirstMonth: PropTypes.bool.isRequired,
    excludeLastMonth: PropTypes.bool.isRequired,
    investmentAccounts: PropTypes.object.isRequired,
    location: PropTypes.string.isRequired,
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(PropTypes.object).isRequired
    }).isRequired
  };

  state = INITIAL_STATE;

  cachedStates = {};

  getSnapshotBeforeUpdate() {
    return this.state;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { location, action } = this.props;

    if (location === prevProps.location) {
      return;
    }

    if (action === "POP") {
      this.cachedStates[prevProps.location] = snapshot;
      this.setState(this.cachedStates[location]);
    }

    if (action === "PUSH") {
      this.cachedStates[prevProps.location] = snapshot;
      this.setState(INITIAL_STATE);
    }

    if (action === "REPLACE") {
      this.setState(INITIAL_STATE);
    }
  }

  handleSelectMonth = month => {
    this.setState(state => ({
      ...state,
      selectedMonth: state.selectedMonth === month ? null : month
    }));
  };

  handleSelectGroup = groupId => {
    this.setState(state => ({
      ...state,
      selectedGroupId: state.selectedGroupId === groupId ? null : groupId
    }));
  };

  handleSelectCategory = categoryId => {
    this.setState(state => ({
      ...state,
      selectedCategoryId:
        state.selectedCategoryId === categoryId ? null : categoryId
    }));
  };

  handleSelectPayee = payeeId => {
    this.setState(state => ({
      ...state,
      selectedPayeeId: state.selectedPayeeId === payeeId ? null : payeeId
    }));
  };

  render() {
    const { budget, excludeFirstMonth, excludeLastMonth } = this.props;
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
      onSelectMonth: this.handleSelectMonth,
      onSelectGroup: this.handleSelectGroup,
      onSelectCategory: this.handleSelectCategory,
      onSelectPayee: this.handleSelectPayee,
      onSetExclusion: this.handleSetExclusion
    });
  }
}

export default CategoriesState;
