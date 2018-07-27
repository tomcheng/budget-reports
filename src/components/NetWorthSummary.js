import React from "react";
import PropTypes from "prop-types";
import TopNumbers from "./TopNumbers";

const NetWorthSummary = ({ assets, liabilities, netWorth }) => (
  <TopNumbers
    numbers={[
      { label: "Liabilities", value: -liabilities },
      { label: "Assets", value: assets },
      { label: "Net Worth", value: netWorth }
    ]}
    roundToDollar
  />
);

NetWorthSummary.propTypes = {
  assets: PropTypes.number.isRequired,
  liabilities: PropTypes.number.isRequired,
  netWorth: PropTypes.number.isRequired
};

export default NetWorthSummary;
