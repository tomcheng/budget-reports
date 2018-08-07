import React, { Component } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import { groupByProp, sumByProp } from "../optimized";
import CollapsibleSection from "./CollapsibleSection";
import { SecondaryText } from "./typeComponents";
import { ListItemLink } from "./ListItem";
import LabelWithTransactionCount from "./LabelWithTransactionCount";
import AmountWithPercentage from "./AmountWithPercentage";

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

  state = { limit: LIMIT };

  handleClickOther = () => {
    this.setState(state => ({ ...state, limit: state.limit + LIMIT }));
  };

  render() {
    const {
      entityKey,
      entitiesById,
      linkFunction,
      limitShowing,
      showTransactionCount,
      title,
      transactions
    } = this.props;
    const { limit } = this.state;
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
    const topEntities = entities.slice(0, limit);
    const otherEntities = entities.slice(limit);

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
        {!!otherEntities.length &&
          limitShowing && (
            <ListItemLink
              to="/"
              onClick={evt => {
                evt.preventDefault();
                this.handleClickOther();
              }}
            >
              {showTransactionCount ? (
                <LabelWithTransactionCount
                  count={sumByProp("transactions")(otherEntities)}
                  label={`+ ${otherEntities.length} other${
                    otherEntities.length === 1 ? "" : "s"
                  }`}
                />
              ) : (
                <SecondaryText>
                  {`+ ${otherEntities.length} other${
                    otherEntities.length === 1 ? "" : "s"
                  }`}
                </SecondaryText>
              )}
              <AmountWithPercentage
                amount={sumByProp("amount")(otherEntities)}
                total={total}
              />
            </ListItemLink>
          )}
      </CollapsibleSection>
    );
  }
}

export default GenericEntitiesSection;
