import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import propEq from "lodash/fp/propEq";
import Section from "./Section";
import TopNumbers from "./TopNumbers";
import SpendingChart from "./SpendingChart";
import Transactions from "./Transactions";

class CategoryBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      categories: PropTypes.array.isRequired,
      id: PropTypes.string.isRequired,
      payeesById: PropTypes.object.isRequired,
      transactions: PropTypes.array.isRequired
    }).isRequired,
    categoryId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired
  };

  render() {
    const { budget, categoryId, currentMonth } = this.props;
    const category = budget.categories.find(
      category => category.id === categoryId
    );
    const transactionsForCategory = budget.transactions.filter(
      propEq("categoryId", categoryId)
    );
    const transactionsForMonth = transactionsForCategory.filter(
      transaction => transaction.date.slice(0, 7) === currentMonth
    );

    return (
      <Fragment>
        <Section>
          <TopNumbers
            numbers={[
              { label: "budgeted", value: category.budgeted },
              { label: "spent", value: -category.activity },
              { label: "available", value: category.balance }
            ]}
          />
        </Section>
        <Section title="Day By Day">
          <SpendingChart
            budgetId={budget.id}
            total={category.balance - category.activity}
            currentMonth={currentMonth}
            transactions={transactionsForCategory}
          />
        </Section>
        <Transactions
          transactions={transactionsForMonth}
          payeesById={budget.payeesById}
          budgetId={budget.id}
          linkToPayee
        />
      </Fragment>
    );
  }
}

export default CategoryBody;
