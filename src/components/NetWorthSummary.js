import React from "react";
// import PropTypes from "prop-types";
import Section from "./Section";
import TopNumbers from "./TopNumbers";

const NetWorthSummary = () => (
  <Section>
    <TopNumbers
      numbers={[
        { label: "Liabilities", value: 50 },
        { label: "Assets", value: 100 },
        { label: "Net Worth", value: 50 }
      ]}
    />
  </Section>
);

NetWorthSummary.propTypes = {};

export default NetWorthSummary;
