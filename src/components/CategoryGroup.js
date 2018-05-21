import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import CategoryListItem from "./CategoryListItem";
import ListItem from "./ListItem";

const StyledListItem = styled(ListItem)`
  font-weight: 600;
`;

class CategoryGroup extends Component {
  static propTypes = {
    categoryGroup: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    currentUrl: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    onToggleGroup: PropTypes.func.isRequired
  };

  render() {
    const {
      categoryGroup,
      categories,
      currentUrl,
      expanded,
      onToggleGroup
    } = this.props;

    return (
      <Fragment>
        <StyledListItem
          onClick={() => {
            onToggleGroup(categoryGroup.id);
          }}
        >
          {categoryGroup.name}
        </StyledListItem>
        <AnimateHeight isExpanded={expanded}>
          {categories.map(category => (
            <CategoryListItem
              key={category.id}
              category={category}
              currentUrl={currentUrl}
            />
          ))}
        </AnimateHeight>
      </Fragment>
    );
  }
}

export default CategoryGroup;
