import React, { Component, PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import { groupBy, groupByProp, sumByProp } from "../dataUtils";
import { Link } from "react-router-dom";
import Collapsible from "./Collapsible";
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
  payee_id: "payees",
};

class GenericEntitiesSection extends Component {
  static propTypes = {
    entitiesById: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    entityKey: PropTypes.oneOf([
      "category_id",
      "category_group_id",
      "payee_id",
    ]),
    emptyName: PropTypes.string,
    entityFunction: PropTypes.func,
    expectNegative: PropTypes.bool,
    expectPositive: PropTypes.bool,
    linkFunction: PropTypes.func,
    limitShowing: PropTypes.bool,
    numMonths: PropTypes.number,
    reverse: PropTypes.bool,
    selectedEntityId: PropTypes.string,
    showAverage: PropTypes.bool,
    showAverageToggle: PropTypes.bool,
    showTransactionCount: PropTypes.bool,
    onClickEntity: PropTypes.func,
    onToggleAverage: PropTypes.func,
  };

  static defaultProps = { emptyName: "(none)" };

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
      emptyName,
      entityKey,
      entityFunction,
      entitiesById,
      expectNegative,
      expectPositive,
      linkFunction,
      limitShowing: limitShowingProp,
      numMonths,
      reverse,
      selectedEntityId,
      showAverage,
      showAverageToggle,
      showTransactionCount,
      title,
      transactions,
      onClickEntity,
      onToggleAverage,
    } = this.props;
    const { allMounted, showAll } = this.state;
    let total = 0;
    const entities = compose([
      sortBy((e) => (reverse ? -e.amount : e.amount)),
      mapWithKeys((transactions, entityId) => {
        const amount = sumByProp("amount")(transactions);
        total += amount;

        return {
          entityId,
          transactions: transactions.length,
          amount,
        };
      }),
      entityFunction ? groupBy(entityFunction) : groupByProp(entityKey),
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
              to={
                linkFunction && !!entitiesById[entityId]
                  ? linkFunction(entityId)
                  : null
              }
              transactions={transactions}
              name={get("name")(entitiesById[entityId]) || emptyName}
              amount={showAverage ? amount / numMonths : amount}
              expectNegative={expectNegative}
              expectPositive={expectPositive}
              selected={entityId === selectedEntityId}
              total={showAverage ? total / numMonths : total}
              id={entityId}
              onClick={onClickEntity}
            />
          )
        )}
        {allMounted && (
          <Collapsible open={showAll}>
            <Fragment>
              {otherEntities.map(({ entityId, transactions, amount }) => (
                <GenericItemLink
                  key={entityId}
                  showTransactionCount={showTransactionCount}
                  to={
                    linkFunction && !!entitiesById[entityId]
                      ? linkFunction(entityId)
                      : null
                  }
                  transactions={transactions}
                  name={get("name")(entitiesById[entityId]) || emptyName}
                  amount={showAverage ? amount / numMonths : amount}
                  expectNegative={expectNegative}
                  expectPositive={expectPositive}
                  selected={entityId === selectedEntityId}
                  total={total}
                  id={entityId}
                  onClick={onClickEntity}
                  isContinuing
                />
              ))}
            </Fragment>
          </Collapsible>
        )}
        {!!otherEntities.length && limitShowing && (
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

const MaybeLink = ({ to, children, ...other }) =>
  to ? (
    <Link {...other} to={to}>
      {children}
    </Link>
  ) : (
    <span {...other}>{children}</span>
  );

class GenericItemLink extends PureComponent {
  render() {
    const {
      showTransactionCount,
      to,
      transactions,
      name,
      amount,
      expectNegative,
      expectPositive,
      total,
      selected,
      id,
      onClick,
      isContinuing,
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
            selected={selected}
            to={to}
          />
        ) : (
          <MaybeLink
            to={to}
            onClick={
              to &&
              ((evt) => {
                evt.stopPropagation();
              })
            }
          >
            <SecondaryText
              style={{
                whiteSpace: "pre",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "inherit",
                fontWeight: selected && 700,
              }}
            >
              {name}
            </SecondaryText>
          </MaybeLink>
        )}
        <AmountWithPercentage
          amount={amount}
          expectNegative={expectNegative}
          expectPositive={expectPositive}
          selected={selected}
          total={total}
        />
      </ListItem>
    );
  }
}

GenericItemLink.propTypes = {
  amount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  transactions: PropTypes.number.isRequired,
  id: PropTypes.string,
  isContinuing: PropTypes.bool,
  selected: PropTypes.bool,
  showTransactionCount: PropTypes.bool,
  to: PropTypes.string,
};

export default GenericEntitiesSection;
