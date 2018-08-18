import { Component } from "react";
import PropTypes from "prop-types";
import { getSetting, setSetting } from "../uiRepo";

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
    return this.props.children({
      ...this.state,
      onSetExclusion: this.handleSetExclusion
    });
  }
}

export default CategoriesState;
