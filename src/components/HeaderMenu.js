import React, { Component } from "react";
import PropTypes from "prop-types";

class HeaderMenu extends Component {
  static propTypes = {
    optionRenderer: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
  };

  render () {
    const { options, optionRenderer } = this.props;
    return (
      <div>{options.map(option => <div key={option.id}>{optionRenderer(option)}</div>)}</div>
    );
  }
}

export default HeaderMenu;
