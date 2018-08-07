import { Component } from "react";
import PropTypes from "prop-types";

class CategoriesState extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  state = { selectedMonth: null };

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
