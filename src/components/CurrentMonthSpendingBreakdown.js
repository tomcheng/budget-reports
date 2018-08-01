import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { getGroupLink } from "../linkUtils";
import { Link } from "react-router-dom";
import Section from "./Section";
import ListItem from "./ListItem";
import { SecondaryText } from "./typeComponents";
import Amount from "./Amount";
import LabelWithTransactionCount from "./LabelWithTransactionCount";

const mapWithKeys = map.convert({ cap: false });

const CurrentMonthSpendingBreakdown = ({ budget, transactions }) => (
  <Section title="Spending Breakdown">
    <CurrentMonthCategoryGroupsContent
      budget={budget}
      transactions={transactions}
    />
  </Section>
);

CurrentMonthSpendingBreakdown.propTypes = {
  budget: PropTypes.shape({
    categoriesById: PropTypes.objectOf(
      PropTypes.shape({
        categoryGroupId: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    categoryGroupsById: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string.isRequired
    })
  ).isRequired
};

class CurrentMonthCategoryGroupsContent extends PureComponent {
  render() {
    const { budget, transactions } = this.props;
    const { categoriesById, categoryGroupsById, id: budgetId } = budget;
    const groups = compose([
      sortBy("amount"),
      mapWithKeys((transactions, groupId) => {
        const group = categoryGroupsById[groupId];
        return {
          group,
          transactions: transactions.length,
          amount: sumBy("amount")(transactions)
        };
      }),
      groupBy(transaction =>
        get([transaction.categoryId, "categoryGroupId"])(categoriesById)
      )
    ])(transactions);

    return groups.map(({ group, transactions, amount }) => (
      <ListItem key={group.id}>
        <Link to={getGroupLink({ budgetId, categoryGroupId: group.id })}>
          <SecondaryText style={{ whiteSpace: "pre" }}>
            <LabelWithTransactionCount
              label={group.name}
              count={transactions}
            />
          </SecondaryText>
        </Link>
        <SecondaryText>
          <Amount amount={amount} />
        </SecondaryText>
      </ListItem>
    ));
  }
}

export default CurrentMonthSpendingBreakdown;
