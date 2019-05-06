import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import get from "lodash/fp/get";
import { SecondaryText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";
import LabelWithMinorText from "./LabelWithMinorText";

const StyledListItem = styled(ListItem)`
  border-top: 0;
  padding-bottom: 0;
`;

const DateSummaryTransaction = ({ category, payee, memo, amount }) => (
  <StyledListItem isContinuing>
    <div style={{ overflow: "hidden" }}>
      <LabelWithMinorText
        label={get("name")(payee) || "(no payee)"}
        minorText={
          get("name")(category) || "(no category)" + (memo ? ` (${memo})` : "")
        }
      />
    </div>
    <SecondaryText>
      <Amount amount={amount} expectNegative />
    </SecondaryText>
  </StyledListItem>
);

DateSummaryTransaction.propTypes = {
  amount: PropTypes.number.isRequired,
  category: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  isContinuing: PropTypes.bool,
  memo: PropTypes.string,
  payee: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
};

export default DateSummaryTransaction;
