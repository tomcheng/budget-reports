import React, { Component } from "react";
import PropTypes from "prop-types";
import CategoryListItem from "./CategoryListItem";

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
    currentUrl: PropTypes.string.isRequired
  };

  state = {
    expanded: false
  };

  handleToggle = () => {
    this.setState(state => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    const { categoryGroup, categories, currentUrl } = this.props;
    const { expanded } = this.state;
    return (
      <div>
        <div onClick={this.handleToggle}>{categoryGroup.name}</div>
        {expanded &&
          categories.map(category => (
            <CategoryListItem
              key={category.id}
              category={category}
              currentUrl={currentUrl}
            />
          ))}
      </div>
    );
  }
}

export default CategoryGroup;
