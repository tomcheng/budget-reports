import React, { Component, PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import { groupBy, groupByProp, sumByProp } from "../dataUtils";
import AnimateHeight from "react-animate-height-auto";
import { Link } from "react-router-dom";
import CollapsibleSection from "./CollapsibleSection";
import { SecondaryText } from "./typeComponents";
import ListItem from "./ListItem";
import NoTransactions from "./NoTransactions";
import LabelWithTransactionCount from "./LabelWithTransactionCount";
import AmountWithPercentage from "./AmountWithPercentage";
import SeeAll from "./SeeAll";

const mapWithKeys = map.convert({ cap: false });
const LIMIT = 5;

const keyToPluralizedName = {
  category_group_id: "category groups",
  category_id: "categories",
  payee_id: "payees"
};

class GenericEntitiesSection extends Component {
  static propTypes = {
    entitiesById: PropTypes.object.isRequired,
    linkFunction: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    entityKey: PropTypes.oneOf([
      "category_id",
      "category_group_id",
      "payee_id"
    ]),
    entityFunction: PropTypes.func,
    showTransactionCount: PropTypes.bool,
    limitShowing: PropTypes.bool,
    numMonths: PropTypes.number,
    selectedEntityId: PropTypes.string,
    showAverage: PropTypes.bool,
    showAverageToggle: PropTypes.bool,
    onClickEntity: PropTypes.func,
    onToggleAverage: PropTypes.func
  };

  state = { showAll: false, allMounted: false };

  handleToggleShowAll = () => {
    const { allMounted, showAll } = this.state;
    if (allMounted) {
      this.setState({ showAll: !showAll });
    } else {
      this.setState({ allMounted: true });
      requestAnimationFrame(() => {
        this.setState({ showAll: true });
      });
    }
  };

  render() {
    const {
      entityKey,
      entityFunction,
      entitiesById,
      linkFunction,
      limitShowing: limitShowingProp,
      numMonths,
      selectedEntityId,
      showAverage,
      showAverageToggle,
      showTransactionCount,
      title,
      transactions,
      onClickEntity,
      onToggleAverage
    } = this.props;
    const { allMounted, showAll } = this.state;
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
      entityFunction ? groupBy(entityFunction) : groupByProp(entityKey)
    ])(transactions);

    const limitShowing = limitShowingProp && entities.length > LIMIT + 1;
    const topEntities = entities.slice(0, LIMIT);
    const otherEntities = entities.slice(LIMIT);

    return (
      <CollapsibleSection
        title={title}
        actions={
          showAverageToggle && (
            <SecondaryText onClick={onToggleAverage}>
              {showAverage ? "average" : "total"}
            </SecondaryText>
          )
        }
      >
        {entities.length === 0 && <NoTransactions />}
        {(limitShowing ? topEntities : entities).map(
          ({ entityId, transactions, amount }) => (
            <GenericItemLink
              key={entityId}
              showTransactionCount={showTransactionCount}
              to={linkFunction(entityId)}
              transactions={transactions}
              name={entitiesById[entityId].name}
              amount={showAverage ? amount / numMonths : amount}
              selected={entityId === selectedEntityId}
              total={showAverage ? total / numMonths : total}
              id={entityId}
              onClick={onClickEntity}
            />
          )
        )}
        {allMounted && (
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
                  selected={entityId === selectedEntityId}
                  total={total}
                  id={entityId}
                  onClick={onClickEntity}
                  isContinuing
                />
              ))}
            </Fragment>
          </AnimateHeight>
        )}
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
      selected,
      id,
      onClick,
      isContinuing
    } = this.props;
    return (
      <ListItem
        isContinuing={isContinuing}
        onClick={onClick && (() => onClick(id))}
      >
        {showTransactionCount ? (
          <LabelWithTransactionCount
            count={transactions}
            label={name}
            to={to}
          />
        ) : (
          <Link
            to={to}
            onClick={evt => {
              evt.stopPropagation();
            }}
          >
            <SecondaryText
              style={{
                whiteSpace: "pre",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "inherit",
                fontWeight: selected && 700
              }}
            >
              {name}
            </SecondaryText>
          </Link>
        )}
        <AmountWithPercentage
          amount={amount}
          total={total}
          selected={selected}
        />
      </ListItem>
    );
  }
}

GenericItemLink.propTypes = {
  amount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  transactions: PropTypes.number.isRequired,
  id: PropTypes.string,
  isContinuing: PropTypes.bool,
  selected: PropTypes.bool,
  showTransactionCount: PropTypes.bool
};

export default GenericEntitiesSection;
