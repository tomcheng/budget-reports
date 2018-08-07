import React, { Component, PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import { groupByProp, sumByProp } from "../optimized";
import AnimateHeight from "react-animate-height-auto";
import CollapsibleSection from "./CollapsibleSection";
import { SecondaryText } from "./typeComponents";
import { ListItemLink } from "./ListItem";
import LabelWithTransactionCount from "./LabelWithTransactionCount";
import AmountWithPercentage from "./AmountWithPercentage";
import SeeAll from "./SeeAll";

const mapWithKeys = map.convert({ cap: false });
const LIMIT = 5;

const keyToPluralizedName = {
  categoryId: "categories",
  payeeId: "payees"
};

class GenericEntitiesSection extends Component {
  static propTypes = {
    entityKey: PropTypes.string.isRequired,
    entitiesById: PropTypes.object.isRequired,
    linkFunction: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    showTransactionCount: PropTypes.bool,
    limitShowing: PropTypes.bool
  };

  static defaultProps = { showTransactionCount: true };

  state = { showAll: false };

  handleToggleShowAll = () => {
    this.setState(state => ({ ...state, showAll: !state.showAll }));
  };

  render() {
    const {
      entityKey,
      entitiesById,
      linkFunction,
      limitShowing: limitShowingProp,
      showTransactionCount,
      title,
      transactions
    } = this.props;
    const { showAll } = this.state;
    let total = 0;
    const entities = compose([
      sortBy("amount"),
      mapWithKeys((transactions, entityId) => {
        const amount = sumByProp("amount")(transactions);
        total += amount;

        return {
          entityId,
          transactions: transactions.length,
          amount
        };
      }),
      groupByProp(entityKey)
    ])(transactions);

    const limitShowing = limitShowingProp && entities.length > LIMIT + 2;
    const topEntities = entities.slice(0, LIMIT);
    const otherEntities = entities.slice(LIMIT);

    return (
      <CollapsibleSection title={title}>
        {(limitShowing ? topEntities : entities).map(
          ({ entityId, transactions, amount }) => (
            <GenericItemLink
              key={entityId}
              showTransactionCount={showTransactionCount}
              to={linkFunction(entityId)}
              transactions={transactions}
              name={entitiesById[entityId].name}
              amount={amount}
              total={total}
            />
          )
        )}
        <AnimateHeight isExpanded={showAll}>
          <Fragment>
            {otherEntities.map(({ entityId, transactions, amount }) => (
              <GenericItemLink
                key={entityId}
                showTransactionCount={showTransactionCount}
                to={linkFunction(entityId)}
                transactions={transactions}
                name={entitiesById[entityId].name}
                amount={amount}
                total={total}
                isContinuing
              />
            ))}
          </Fragment>
        </AnimateHeight>
        {!!otherEntities.length &&
          limitShowing && (
            <SeeAll
              count={entities.length}
              pluralizedName={keyToPluralizedName[entityKey]}
              showAll={showAll}
              onToggle={this.handleToggleShowAll}
            />
          )}
      </CollapsibleSection>
    );
  }
}

class GenericItemLink extends PureComponent {
  render() {
    const {
      showTransactionCount,
      to,
      transactions,
      name,
      amount,
      total,
      isContinuing
    } = this.props;
    return (
      <ListItemLink to={to} isContinuing={isContinuing}>
        {showTransactionCount ? (
          <LabelWithTransactionCount count={transactions} label={name} />
        ) : (
          <SecondaryText
            style={{
              whiteSpace: "pre",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {name}
          </SecondaryText>
        )}
        <AmountWithPercentage amount={amount} total={total} />
      </ListItemLink>
    );
  }
}

GenericItemLink.propTypes = {
  amount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  transactions: PropTypes.number.isRequired,
  isContinuing: PropTypes.bool,
  showTransactionCount: PropTypes.bool
};

export default GenericEntitiesSection;
