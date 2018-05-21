import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CategoryListItem from "./CategoryListItem";

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
  font-weight: 600;
  white-space: pre;
  user-select: none;
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
        <Container onClick={this.handleToggle}>{categoryGroup.name}</Container>
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
