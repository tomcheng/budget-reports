import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import Separator from "./Separator";

class CategoryGroupTitle extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      categories: PropTypes.array.isRequired,
      categoryGroups: PropTypes.array.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    categoryGroupId: PropTypes.string.isRequired,
    onClearCategory: PropTypes.func.isRequired,
    categoryId: PropTypes.string
  };

  render() {
    const { budget, categoryGroupId, categoryId, onClearCategory } = this.props;
    const categoryGroup = budget.categoryGroups.find(
      group => group.id === categoryGroupId
    );
    const category = budget.categories.find(
      category => category.id === categoryId
    );

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div onClick={onClearCategory} style={{ cursor: "pointer" }}>
          {categoryGroup.name}
        </div>
        {category && (
          <Fragment>
            <Separator />
            {category.name}
          </Fragment>
        )}
      </div>
    );
  }
}

export default CategoryGroupTitle;
