import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import { SecondaryText } from "./typeComponents";
import AmountWithPercentage from "./AmountWithPercentage";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

class BreakdownCategoryListItem extends Component {
  static propTypes = {
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      payees: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired,
    total: PropTypes.number.isRequired
  };

  state = { expanded: false };

  handleToggleExpand = () => {
    this.setState(state => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    const { category, total } = this.props;
    const { expanded } = this.state;

    return (
      <Fragment>
        <Container onClick={this.handleToggleExpand}>
          <SecondaryText>{category.name}</SecondaryText>
          <AmountWithPercentage
            amount={category.amount}
            total={total}
            faded={expanded}
          />
        </Container>
        <AnimateHeight isExpanded={expanded}>
          <div>
            {category.payees.map(payee => (
              <Container key={payee.id}>
                <SecondaryText>{payee.name}</SecondaryText>
                <AmountWithPercentage amount={payee.amount} total={total} />
              </Container>
            ))}
          </div>
        </AnimateHeight>
      </Fragment>
    );
  }
}

export default BreakdownCategoryListItem;
