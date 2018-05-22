import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import sumBy from "lodash/sumBy";
import AnimateHeight from "react-animate-height-auto";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faChevronRight from "@fortawesome/fontawesome-free-solid/faChevronRight";
import CategoryListItem from "./CategoryListItem";
import ListItem from "./ListItem";
import CategorySummary from "./CategorySummary";

const TOGGLE_ICON_SPACING = 20;

class CategoryGroup extends Component {
  static propTypes = {
    categoryGroup: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        activity: PropTypes.number.isRequired,
        balance: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    currentUrl: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    monthProgress: PropTypes.number.isRequired,
    onToggleGroup: PropTypes.func.isRequired
  };

  render() {
    const {
      categoryGroup,
      categories,
      currentUrl,
      expanded,
      monthProgress,
      onToggleGroup
    } = this.props;

    return (
      <Fragment>
        <ListItem
          style={{ fontWeight: 600 }}
          onClick={() => {
            onToggleGroup(categoryGroup.id);
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: TOGGLE_ICON_SPACING, fontWeight: 400, color: "#888", fontSize: 10 }}>
              <FontAwesomeIcon
                icon={faChevronRight}
                transform={{ rotate: expanded ? 90 : 0 }}
              />
            </div>
            {categoryGroup.name}
          </div>
          <CategorySummary
            activity={sumBy(categories, "activity")}
            balance={sumBy(categories, "balance")}
            monthProgress={monthProgress}
          />
        </ListItem>
        <AnimateHeight isExpanded={expanded}>
          {categories.map(category => (
            <CategoryListItem
              key={category.id}
              category={category}
              currentUrl={currentUrl}
              leftSpacing={TOGGLE_ICON_SPACING}
              monthProgress={monthProgress}
            />
          ))}
        </AnimateHeight>
      </Fragment>
    );
  }
}

export default CategoryGroup;
