import React, { Component, Fragment } from "react";
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
            <ListItemLink key={entityId} to={linkFunction(entityId)}>
              {showTransactionCount ? (
                <LabelWithTransactionCount
                  count={transactions}
                  label={entitiesById[entityId].name}
                  style={{
                    whiteSpace: "pre",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                />
              ) : (
                <SecondaryText
                  style={{
                    whiteSpace: "pre",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {entitiesById[entityId].name}
                </SecondaryText>
              )}
              <AmountWithPercentage amount={amount} total={total} />
            </ListItemLink>
          )
        )}
        <AnimateHeight isExpanded={showAll}>
          <Fragment>
            {otherEntities.map(({ entityId, transactions, amount }) => (
              <ListItemLink
                key={entityId}
                to={linkFunction(entityId)}
                isContinuing
              >
                {showTransactionCount ? (
                  <LabelWithTransactionCount
                    count={transactions}
                    label={entitiesById[entityId].name}
                    style={{
                      whiteSpace: "pre",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  />
                ) : (
                  <SecondaryText
                    style={{
                      whiteSpace: "pre",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {entitiesById[entityId].name}
                  </SecondaryText>
                )}
                <AmountWithPercentage amount={amount} total={total} />
              </ListItemLink>
            ))}
          </Fragment>
        </AnimateHeight>
        {!!otherEntities.length &&
          limitShowing && (
            <SeeAll showAll={showAll} onToggle={this.handleToggleShowAll} />
          )}
      </CollapsibleSection>
    );
  }
}

export default GenericEntitiesSection;
