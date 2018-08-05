import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import { getTransactionMonth } from "../utils";
import { getCategoryLink } from "../linkUtils";
import MonthByMonthSection from "./MonthByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

class GroupBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          categoryId: PropTypes.string
        })
      ).isRequired,
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    categoryGroup: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  state = { selectedMonth: null };

  handleSelectMonth = month => {
    this.setState(state => ({
      ...state,
      selectedMonth: state.selectedMonth === month ? null : month
    }));
  };

  render() {
    const { categoryGroup, budget } = this.props;
    const { selectedMonth } = this.state;
    const { transactions, categories, categoriesById, id: budgetId } = budget;

    const categoriesInGroup = categories.filter(
      category => category.categoryGroupId === categoryGroup.id
    );
    const categoryIds = categoriesInGroup.map(category => category.id);
    const transactionsInGroup = transactions.filter(transaction =>
      categoryIds.includes(transaction.categoryId)
    );
    const transactionsInSelectedMonth =
      selectedMonth &&
      compose([
        sortBy("amount"),
        transactions =>
          transactions.filter(
            transaction => getTransactionMonth(transaction) === selectedMonth
          )
      ])(transactionsInGroup);

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={getTransactionMonth(
            transactions[transactions.length - 1]
          )}
          selectedMonth={selectedMonth}
          transactions={transactionsInGroup}
          onSelectMonth={this.handleSelectMonth}
        />
        <GenericEntitiesSection
          entityKey="categoryId"
          entitiesById={categoriesById}
          linkFunction={categoryId =>
            getCategoryLink({
              budgetId,
              categoryGroupId: categoryGroup.id,
              categoryId
            })
          }
          title="Categories"
          transactions={transactionsInSelectedMonth || transactionsInGroup}
        />
      </Fragment>
    );
  }
}

export default GroupBody;
