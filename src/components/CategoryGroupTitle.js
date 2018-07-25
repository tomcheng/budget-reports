import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import matchesProperty from "lodash/fp/matchesProperty";
import { getCategoryLink } from "../utils";
import Dropdown from "./Dropdown";
import Icon from "./Icon";

class CategoryGroupTitle extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      categories: PropTypes.array.isRequired,
      categoryGroups: PropTypes.array.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    categoryGroupId: PropTypes.string.isRequired
  };

  render() {
    const { budget, categoryGroupId } = this.props;
    const { id: budgetId, categoryGroups, categories: allCategories } = budget;

    const categoryGroup = find(matchesProperty("id", categoryGroupId))(
      categoryGroups
    );
    const categories = filter(
      matchesProperty("categoryGroupId", categoryGroupId)
    )(allCategories);

    return (
      <Dropdown
        links={categories.map(category => ({
          to: getCategoryLink({ budgetId, categoryId: category.id }),
          label: category.name,
          replace: true
        }))}
      >
        {({ ref, triggerStyle, onClick }) => (
          <div
            ref={ref}
            onClick={onClick}
            style={{
              ...triggerStyle,
              alignSelf: "stretch",
              display: "inline-flex",
              alignItems: "center"
            }}
          >
            {categoryGroup.name}
            <div style={{ padding: "0 8px", color: "#444" }}>
              <Icon icon="caret-down" />
            </div>
          </div>
        )}
      </Dropdown>
    );
  }
}

export default CategoryGroupTitle;
