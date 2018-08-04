import React, { Component } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import styled from "styled-components";
import { selectedPlotBandColor } from "../styleVariables";
import AnimateHeight from "react-animate-height-auto";
import Section from "./Section";
import { SecondaryText, MinorText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";
import LabelWithTransactionCount from "./LabelWithTransactionCount";

const mapWithKeys = map.convert({ cap: false });

const StyledListItem = styled(ListItem)`
  background-color: ${props => props.selected && selectedPlotBandColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 2px;
  border-top: 0 !important;
  margin-top: 0;

  .collapsed & {
    background-color: transparent;
  }
`;

class CategoryBreakdown extends Component {
  static propTypes = {
    categoriesById: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    transactions: PropTypes.array.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    selectedCategoryId: PropTypes.string
  };

  state = { expanded: true };

  handleClickToggle = () => {
    this.setState(state => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    const {
      categoriesById,
      selectedCategoryId,
      transactions,
      onSelectCategory
    } = this.props;
    const { expanded } = this.state;

    const categoriesWithData = compose([
      sortBy("amount"),
      mapWithKeys((transactions, categoryId) => ({
        category: categoriesById[categoryId],
        count: transactions.length,
        amount: sumBy("amount")(transactions)
      })),
      groupBy("categoryId")
    ])(transactions);

    return (
      <Section top noPadding style={{ borderBottom: "1px solid #e5e5e5" }}>
        <AnimateHeight isExpanded={expanded}>
          <div
            style={{
              padding: "10px 13px",
              backgroundColor: "#fafafa",
              borderTop: "1px solid #eee"
            }}
          >
            {categoriesWithData.map(({ category, count, amount }) => (
              <StyledListItem
                key={category.id}
                selected={category.id === selectedCategoryId}
                onClick={() => {
                  onSelectCategory(category.id);
                }}
              >
                <SecondaryText>
                  <LabelWithTransactionCount
                    label={category.name}
                    count={count}
                  />
                </SecondaryText>
                <SecondaryText>
                  <Amount amount={amount} />
                </SecondaryText>
              </StyledListItem>
            ))}
          </div>
        </AnimateHeight>
        <MinorText
          style={{
            textAlign: "center",
            padding: "5px 0",
            userSelect: "none",
            borderTop: "1px solid #eee"
          }}
          onClick={this.handleClickToggle}
        >
          {expanded ? "hide" : "show"} categories
        </MinorText>
      </Section>
    );
  }
}

export default CategoryBreakdown;
