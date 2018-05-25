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
  text-align: center;
`;

const Label = styled(MinorText)`
  margin-top: -4px;
`;

const TopNumbers = ({ budgeted, spent, available }) => (
  <Container>
    <Group>
      <LargeNumber>${budgeted.toFixed(2)}</LargeNumber>
      <Label>budgeted</Label>
    </Group>
    <Group>
      <LargeNumber>${spent.toFixed(2)}</LargeNumber>
      <Label>spent</Label>
    </Group>
    <Group>
      <LargeNumber>${available.toFixed(2)}</LargeNumber>
      <Label>available</Label>
    </Group>
  </Container>
);

TopNumbers.propTypes = {
  available: PropTypes.number.isRequired,
  budgeted: PropTypes.number.isRequired,
  spent: PropTypes.number.isRequired
};

export default TopNumbers;
