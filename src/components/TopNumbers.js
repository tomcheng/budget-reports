import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { MinorText, LargeNumber } from "./typeComponents";

const Container = styled.div`
  margin: 20px;
  display: flex;
`;

const Group = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 33.333333%;
  text-align: center;
`;

const Label = styled(MinorText)`
  margin-top: -4px;
`;

const TopNumbers = ({ numbers, roundToDollar }) => (
  <Container>
    {numbers.map(({ label, value }) => (
      <Group key={label}>
        <LargeNumber>${value.toFixed(roundToDollar ? 0 : 2)}</LargeNumber>
        <Label>{label}</Label>
      </Group>
    ))}
  </Container>
);

TopNumbers.propTypes = {
  numbers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ).isRequired,
  roundToDollar: PropTypes.bool
};

TopNumbers.defaultProps = { roundToDollar: false };

export default TopNumbers;
