import { Component } from "react";
import PropTypes from "prop-types";

class CategoriesState extends Component {
  static propTypes = {
    action: PropTypes.oneOf(["PUSH", "POP", "REPLACE"]).isRequired,
    children: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired
  };

  state = { selectedMonth: null };

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
      this.setState({ selectedMonth: null });
    }

    if (action === "REPLACE") {
      this.setState({ selectedMonth: null });
    }
  }

  handleSelectMonth = month => {
    this.setState(state => ({
      ...state,
      selectedMonth: state.selectedMonth === month ? null : month
    }));
  };

  render() {
    return this.props.children({
      selectedMonth: this.state.selectedMonth,
      onSelectMonth: this.handleSelectMonth
    });
  }
}

export default CategoriesState;
