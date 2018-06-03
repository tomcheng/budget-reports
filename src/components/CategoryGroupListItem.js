import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import round from "lodash/round";
import sumBy from "lodash/sumBy";
import AnimateHeight from "react-animate-height-auto";
import { Link } from "react-router-dom";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import maxBy from "lodash/maxBy";
import sortBy from "lodash/sortBy";
import { getGroupLink, simpleMemoize } from "../utils";
import { StrongText } from "./typeComponents";
import Icon from "./Icon";
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

  getSortedCategories = simpleMemoize((categories, allTransactions) => {
    const categoryIds = categories.map(category => category.id);
    const transactions = allTransactions.filter(
      transaction =>
        transaction.categoryId && categoryIds.includes(transaction.categoryId)
    );
    const transactionsByCategory = groupBy(
      transactions,
      transaction => transaction.categoryId
    );

    return sortBy(categories, category =>
      get(
        maxBy(transactionsByCategory[category.id], "date"),
        "date",
        "0000-00-00"
      )
    ).reverse();
  });

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
    const activity = sumBy(categories, "activity");
    const balance = sumBy(categories, "balance");

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
          {this.getSortedCategories(categories, transactions).map(category => (
            <CategoryListItem
              key={category.id}
              budgetId={budgetId}
              category={category}
              leftSpacing={TOGGLE_ICON_SPACING}
              monthProgress={monthProgress}
            />
          ))}
        </AnimateHeight>
      </Container>
    );
  }
}

export default CategoryGroupListItem;
