import React from "react";
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

const GenericEntitiesSection = ({ entityKey, entitiesById, linkFunction, transactions }) => {
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

  return (
    <CollapsibleSection title="Categories">
      {entities.map(({ entityId, transactions, amount }) => (
        <ListItemLink key={entityId} to={linkFunction(entityId)}>
          <SecondaryText style={{ whiteSpace: "pre" }}>
            <LabelWithTransactionCount
              count={transactions}
              label={entitiesById[entityId].name}
            />
          </SecondaryText>
          <AmountWithPercentage amount={amount} total={total} />
        </ListItemLink>
      ))}
    </CollapsibleSection>
  );
};

GenericEntitiesSection.propTypes = {
  entityKey: PropTypes.string.isRequired,
  entitiesById: PropTypes.object.isRequired,
  linkFunction: PropTypes.func.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default GenericEntitiesSection;
