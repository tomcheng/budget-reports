import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getGroupLink } from "../linkUtils";
import Separator from "./Separator";

class CategoryTitle extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      categories: PropTypes.array.isRequired,
      categoryGroups: PropTypes.array.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    categoryId: PropTypes.string.isRequired
  };

  render() {
    const { budget, categoryId } = this.props;
    const category = budget.categories.find(
      category => category.id === categoryId
    );
    const categoryGroup = budget.categoryGroups.find(
      group => group.id === category.categoryGroupId
    );

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to={getGroupLink({
            budgetId: budget.id,
            categoryGroupId: categoryGroup.id
          })}
        >
          {categoryGroup.name}
        </Link>
        <Separator />
        {category.name}
      </div>
    );
  }
}

export default CategoryTitle;
