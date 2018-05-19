import React, { Component } from "react";
import PropTypes from "prop-types";
import Category from "./Category";

class CategoryGroup extends Component {
  static propTypes = {
    categoryGroup: PropTypes.shape({
      id: PropTypes.string.isRequired,
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          categories: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired
            })
          ).isRequired
        })
      ).isRequired
    }).isRequired
  };

  state = {
    expanded: false
  };

  handleToggle = () => {
    this.setState(state => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    const { name, categories } = this.props.categoryGroup;
    const { expanded } = this.state;
    return (
      <div>
        <div onClick={this.handleToggle}>{name}</div>
        {expanded &&
          categories.map(category => (
            <Category key={category.id} category={category} />
          ))}
      </div>
    );
  }
}

export default CategoryGroup;
