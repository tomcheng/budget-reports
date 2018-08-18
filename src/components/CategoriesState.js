import { Component } from "react";
import PropTypes from "prop-types";

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
    location: PropTypes.string.isRequired
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
    return this.props.children({
      ...this.state,
      onSelectMonth: this.handleSelectMonth,
      onSelectGroup: this.handleSelectGroup,
      onSelectCategory: this.handleSelectCategory,
      onSelectPayee: this.handleSelectPayee,
      onSetExclusion: this.handleSetExclusion
    });
  }
}

export default CategoriesState;
