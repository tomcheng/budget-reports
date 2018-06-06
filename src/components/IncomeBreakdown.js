import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { StrongText } from "./typeComponents";
import Section from "./Section";
import Breakdown from "./Breakdown";

const IncomeBreakdown = ({ selectedMonth, ...other }) => (
  <Section>
    <StrongText>
      Income for {moment(selectedMonth, "YYYY-MM").format("MMMM YYYY")}
    </StrongText>
    <Breakdown {...other} />
  </Section>
);

IncomeBreakdown.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      categoryGroupId: PropTypes.string.isRequired
    })
  ).isRequired,
  categoryGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  payees: PropTypes.objectOf(PropTypes.shape({})).isRequired,
  selectedMonth: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired,
  reverse: PropTypes.bool
};

export default IncomeBreakdown;
