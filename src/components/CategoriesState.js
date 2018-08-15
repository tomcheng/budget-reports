import { Component } from "react";
import PropTypes from "prop-types";

const INITIAL_STATE = {
  selectedMonths: [],
  selectedGroupIds: [],
  selectedCategoryIds: []
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
      selectedMonths: state.selectedMonths.includes(month)
        ? state.selectedMonths.filter(id => id !== month)
        : state.selectedMonths.concat(month)
    }));
  };

  handleSelectGroup = groupId => {
    this.setState(state => ({
      ...state,
      selectedGroupIds: state.selectedGroupIds.includes(groupId)
        ? state.selectedGroupIds.filter(id => id !== groupId)
        : state.selectedGroupIds.concat(groupId)
    }));
  };

  handleSelectCategory = categoryId => {
    this.setState(state => ({
      ...state,
      selectedCategoryIds: state.selectedCategoryIds.includes(categoryId)
        ? state.selectedCategoryIds.filter(id => id !== categoryId)
        : state.selectedCategoryIds.concat(categoryId)
    }));
  };

  render() {
    return this.props.children({
      ...this.state,
      onSelectMonth: this.handleSelectMonth,
      onSelectGroup: this.handleSelectGroup,
      onSelectCategory: this.handleSelectCategory
    });
  }
}

export default CategoriesState;
