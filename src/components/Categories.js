import React, { Component } from "react";
import PropTypes from "prop-types";
import { setSetting, getSetting, PAYEES_SORT_ORDER } from "../uiRepo";
import PageWrapper from "./PageWrapper";
import CategoriesBody from "./CategoriesBody";
import { MinorText, SecondaryText } from "./typeComponents";
import Dropdown from "./Dropdown";

const SORT_LABELS = {
  amount: "Amount",
  name: "Name",
  transactions: "Transactions"
};

const SORT_OPTIONS = ["amount", "transactions", "name"];

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
    const {
      authorized,
      budget,
      budgetId,
      title,
      onAuthorize,
      onRequestBudget
    } = this.props;
    const { sort } = this.state;

    return (
      <PageWrapper
        authorized={authorized}
        budgetId={budgetId}
        budgetLoaded={!!budget}
        onAuthorize={onAuthorize}
        onRequestBudget={onRequestBudget}
        title={title}
        actions={
          <Dropdown
            dropdownContent={({ onClose }) =>
              SORT_OPTIONS.map(sortOption => (
                <Dropdown.Option
                  key={sortOption}
                  onClick={() => {
                    this.handleChangeSort(sortOption);
                    onClose();
                  }}
                  isSelected={sortOption === sort}
                >
                  {SORT_LABELS[sortOption]}
                </Dropdown.Option>
              ))
            }
            align="right"
          >
            {({ triggerStyle, onClick, ref }) => (
              <div
                style={{ ...triggerStyle, textAlign: "right" }}
                onClick={onClick}
                ref={ref}
              >
                <MinorText>Sort by:</MinorText>
                <SecondaryText>{SORT_LABELS[sort]}</SecondaryText>
              </div>
            )}
          </Dropdown>
        }
        content={() => <CategoriesBody budget={budget} sort={sort} />}
      />
    );
  }
}

export default Categories;
