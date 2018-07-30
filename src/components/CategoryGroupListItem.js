import React, { Component, Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import compose from "lodash/fp/compose";
import filter from "lodash/fp/filter";
import getOr from "lodash/fp/getOr";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import maxBy from "lodash/fp/maxBy";
import reverse from "lodash/fp/reverse";
import round from "lodash/fp/round";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import AnimateHeight from "react-animate-height-auto";
import { Link } from "react-router-dom";
import { simpleMemoize } from "../utils";
import { getGroupLink } from "../linkUtils";
import { iconWidth } from "../styleVariables";
import { StrongText } from "./typeComponents";
import Icon from "./Icon";
import CategoryListItem from "./CategoryListItem";
import SummaryChart from "./SummaryChart";

const Container = styled.div`
  & + & {
    border-top: 1px solid #eee;
  }
`;

const GroupArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  white-space: pre;
  user-select: none;
`;

class CategoryGroupListItem extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
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
    expanded: PropTypes.bool.isRequired,
    monthProgress: PropTypes.number.isRequired,
    showing: PropTypes.oneOf(["available", "spent"]).isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        categoryId: PropTypes.string,
        date: PropTypes.string.isRequired
      })
    ).isRequired,
    onToggleGroup: PropTypes.func.isRequired
  };

  getCategoriesForGroup = simpleMemoize((allCategories, categoryGroupId) =>
    filter(matchesProperty("categoryGroupId", categoryGroupId))(allCategories)
  );

  getSortedCategories = simpleMemoize((categories, transactions) => {
    const categoryIds = map("id")(categories);
    const transactionsByCategory = compose([
      groupBy("categoryId"),
      filter(
        transaction =>
          transaction.categoryId && categoryIds.includes(transaction.categoryId)
      )
    ])(transactions);

    return compose([
      reverse,
      sortBy(
        compose([
          getOr("0000-00-00")("date"),
          maxBy("date"),
          category => transactionsByCategory[category.id]
        ])
      )
    ])(categories);
  });

  render() {
    const {
      budgetId,
      categoryGroup,
      categories: allCategories,
      expanded,
      monthProgress,
      showing,
      transactions,
      onToggleGroup
    } = this.props;
    const categories = this.getCategoriesForGroup(
      allCategories,
      categoryGroup.id
    );
    const activity = sumBy("activity")(categories);
    const balance = sumBy("balance")(categories);

    return (
      <Container>
        <GroupArea>
          <div
            onClick={() => {
              onToggleGroup(categoryGroup.id);
            }}
            style={{
              alignSelf: "stretch",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: iconWidth,
              fontWeight: 400,
              color: "#888",
              fontSize: 10
            }}
          >
            <Icon
              icon="chevron-right"
              transform={{ rotate: expanded ? 90 : 0 }}
            />
          </div>
          <Link
            to={getGroupLink({
              budgetId,
              categoryGroupId: categoryGroup.id
            })}
            style={{
              flexGrow: 1,
              alignSelf: "stretch",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: 20
            }}
          >
            <StrongText>{categoryGroup.name}</StrongText>
            <div
              style={{
                width: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <SummaryChart
                activity={activity}
                balance={balance}
                indicator={monthProgress}
              />
              <StrongText>
                {round(showing === "available" ? balance : -activity)}
              </StrongText>
            </div>
          </Link>
        </GroupArea>
        <AnimateHeight isExpanded={expanded}>
          <Categories
            categories={this.getSortedCategories(categories, transactions)}
            budgetId={budgetId}
            monthProgress={monthProgress}
            showing={showing}
          />
        </AnimateHeight>
      </Container>
    );
  }
}

class Categories extends PureComponent {
  render() {
    const { categories, budgetId, monthProgress, showing } = this.props;
    return (
      <Fragment>
        {categories.map(category => (
          <CategoryListItem
            key={category.id}
            budgetId={budgetId}
            category={category}
            leftSpacing={iconWidth}
            monthProgress={monthProgress}
            showing={showing}
          />
        ))}
      </Fragment>
    );
  }
}

export default CategoryGroupListItem;
