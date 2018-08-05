import React, { Component } from "react";
import PropTypes from "prop-types";
import { setSetting, getSetting, PAYEES_SORT_ORDER } from "../uiRepo";
import PageWrapper from "./PageWrapper";
import CategoriesBody from "./CategoriesBody";
import SortDropdown from "./SortDropdown";

const SORT_OPTIONS = [
  { label: "Amount", value: "amount" },
  { label: "Transactions", value: "transactions" },
  { label: "Name", value: "name" }
];

class Categories extends Component {
  static propTypes = {
    authorized: PropTypes.bool.isRequired,
    budgetId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onAuthorize: PropTypes.func.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
    budget: PropTypes.object
  };

  constructor(props) {
    super();

    this.state = { sort: getSetting(PAYEES_SORT_ORDER, props.budgetId) };
  }

  handleChangeSort = sort => {
    this.setState({ sort });
    setSetting(PAYEES_SORT_ORDER, this.props.budgetId, sort);
  };

  render() {
    const { budget, ...other } = this.props;
    const { sort } = this.state;

    return (
      <PageWrapper
        {...other}
        budgetLoaded={!!budget}
        actions={
          <SortDropdown
            options={SORT_OPTIONS}
            selected={sort}
            onChange={this.handleChangeSort}
          />
        }
        content={() => <CategoriesBody budget={budget} sort={sort} />}
      />
    );
  }
}

export default Categories;
