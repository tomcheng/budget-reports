import { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import omit from "lodash/fp/omit";
import { notAny, simpleMemoize } from "../dataUtils";
import {
  getFirstMonth,
  getTransactionMonth,
  isIncome,
  isStartingBalanceOrReconciliation,
  isTransfer
} from "../budgetUtils";

const INITIAL_STATE = {
  excludeFirstMonth: false,
  excludeLastMonth: false,
  selectedMonth: null,
  selectedGroupId: null,
  selectedCategoryId: null,
  selectedPayeeId: null
};

class CategoriesState extends Component {
  static propTypes = {
    action: PropTypes.oneOf(["PUSH", "POP", "REPLACE"]).isRequired,
    children: PropTypes.func.isRequired,
    investmentAccounts: PropTypes.object.isRequired,
    location: PropTypes.string.isRequired,
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(PropTypes.object).isRequired
    }).isRequired
  };

  state = INITIAL_STATE;

  cachedStates = {};

  getSnapshotBeforeUpdate() {
    return omit(["excludeFirstMonth", "excludeLastMonth"])(this.state);
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

  handleSetExclusion = ({ month, exclude }) => {
    this.setState({
      [month === "first" ? "excludeFirstMonth" : "excludeLastMonth"]: exclude
    });
  };

  getFilteredTransactions = simpleMemoize(
    (budget, investmentAccounts, excludeFirstMonth, excludeLastMonth) => {
      const firstMonth = getFirstMonth(budget);
      const lastMonth = moment().format("YYYY-MM");
      return budget.transactions.filter(
        notAny([
          isStartingBalanceOrReconciliation(budget),
          isTransfer(investmentAccounts),
          isIncome(budget),
          transaction =>
            excludeFirstMonth &&
            getTransactionMonth(transaction) === firstMonth,
          transaction =>
            excludeLastMonth && getTransactionMonth(transaction) === lastMonth
        ])
      );
    }
  );

  render() {
    const { budget, investmentAccounts } = this.props;
    const { excludeFirstMonth, excludeLastMonth } = this.state;
    const filteredTransactions = this.getFilteredTransactions(
      budget,
      investmentAccounts,
      excludeFirstMonth,
      excludeLastMonth
    );
    const firstBudgetMonth = getFirstMonth(budget);
    const firstMonth = excludeFirstMonth
      ? moment(firstBudgetMonth)
        .add(1, "months")
        .format("YYYY-MM")
      : firstBudgetMonth;
    const current = moment();
    const numMonths = current.diff(firstMonth, "months") + 1;

    return this.props.children({
      ...this.state,
      filteredTransactions,
      firstMonth,
      numMonths,
      onSelectMonth: this.handleSelectMonth,
      onSelectGroup: this.handleSelectGroup,
      onSelectCategory: this.handleSelectCategory,
      onSelectPayee: this.handleSelectPayee,
      onSetExclusion: this.handleSetExclusion
    });
  }
}

export default CategoriesState;
