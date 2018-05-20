import React, { Component } from "react";
import PropTypes from "prop-types";
import Category from "./Category";

class CategoryGroup extends Component {
  static propTypes = {
    categoryGroup: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    onSelectCategory: PropTypes.func.isRequired
  };

  state = {
    expanded: false
  };

  handleToggle = () => {
    this.setState(state => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    const { categoryGroup, categories, onSelectCategory } = this.props;
    const { expanded } = this.state;
    return (
      <div>
        <div onClick={this.handleToggle}>{categoryGroup.name}</div>
        {expanded &&
          categories.map(category => (
            <Category
              key={category.id}
              category={category}
              onSelectCategory={onSelectCategory}
            />
          ))}
      </div>
    );
  }
}

export default CategoryGroup;
