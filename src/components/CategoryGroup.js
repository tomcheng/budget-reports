import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CategoryListItem from "./CategoryListItem";
import ListItem from "./ListItem";

const StyledListItem = styled(ListItem)`
  font-weight: 600;
`;

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
      <Fragment>
        <StyledListItem onClick={this.handleToggle}>
          {categoryGroup.name}
        </StyledListItem>
        {expanded &&
          categories.map(category => (
            <CategoryListItem
              key={category.id}
              category={category}
              currentUrl={currentUrl}
            />
          ))}
      </Fragment>
    );
  }
}

export default CategoryGroup;
