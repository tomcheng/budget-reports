import React, { Component, Fragment } from "react";
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
import { getGroupLink, simpleMemoize } from "../../utils";
import { StrongText } from "../common/typeComponents";
import Icon from "../common/Icon";
import CategoryListItem from "./CategoryListItem";
import SummaryChart from "./SummaryChart";

const TOGGLE_ICON_SPACING = 50;

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
  padding: 0 20px 0 0;
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
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        categoryId: PropTypes.string,
        date: PropTypes.string.isRequired
      })
    ).isRequired,
    onToggleGroup: PropTypes.func.isRequired
  };

  getSortedCategories = simpleMemoize(
    (allCategories, allTransactions, categoryGroupId) => {
      const categories = filter(
        matchesProperty("categoryGroupId", categoryGroupId)
      )(allCategories);
      const categoryIds = map("id")(categories);
      const transactionsByCategory = compose([
        groupBy("categoryId"),
        filter(
          transaction =>
            transaction.categoryId &&
            categoryIds.includes(transaction.categoryId)
        )
      ])(allTransactions);

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
    }
  );

  render() {
    const {
      budgetId,
      categoryGroup,
      categories,
      expanded,
      monthProgress,
      transactions,
      onToggleGroup
    } = this.props;
    const activity = sumBy("activity")(categories);
    const balance = sumBy("balance")(categories);

    return (
      <Container>
        <Link
          to={getGroupLink({
            budgetId,
            categoryGroupId: categoryGroup.id
          })}
        >
          <GroupArea>
            <div
              onClick={evt => {
                evt.preventDefault();
                onToggleGroup(categoryGroup.id);
              }}
              style={{
                alignSelf: "stretch",
                display: "flex",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: TOGGLE_ICON_SPACING,
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
            </div>
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "space-between"
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
                <StrongText>{round(balance)}</StrongText>
              </div>
            </div>
          </GroupArea>
        </Link>
        <AnimateHeight isExpanded={expanded}>
          <Categories
            categories={this.getSortedCategories(
              categories,
              transactions,
              categoryGroup.id
            )}
            budgetId={budgetId}
            monthProgress={monthProgress}
          />
        </AnimateHeight>
      </Container>
    );
  }
}

class Categories extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.categories !== nextProps.categories ||
      this.props.budgetId !== nextProps.budgetId ||
      this.props.monthProgress !== nextProps.monthProgress
    );
  }

  render() {
    const { categories, budgetId, monthProgress } = this.props;
    return (
      <Fragment>
        {categories.map(category => (
          <CategoryListItem
            key={category.id}
            budgetId={budgetId}
            category={category}
            leftSpacing={TOGGLE_ICON_SPACING}
            monthProgress={monthProgress}
          />
        ))}
      </Fragment>
    );
  }
}

export default CategoryGroupListItem;
