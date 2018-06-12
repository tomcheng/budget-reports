import React from "react";
import styled from "styled-components";
import Icon from "./Icon";

const Container = styled.div`
  padding: 0 8px;
  font-size: 10px;
  line-height: 10px;
  color: #888;
`;

const Separator = () => (
  <Container>
    <Icon icon="chevron-right" />
  </Container>
);

Separator.propTypes = {};

export default Separator;
