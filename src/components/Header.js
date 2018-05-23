import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import { getLastUpdated } from "../uiRepo";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
`;

const Title = styled.div`
  font-weight: 600;
`;

const Header = ({ title, onRefreshData, budgetId }) => (
  <Container>
    <Title>{title}</Title>
    <div>
      <button
        onClick={() => {
          onRefreshData(budgetId);
        }}
      >
        Refresh
      </button>
      Updated{" "}
      {moment(getLastUpdated(budgetId) || undefined).fromNow()}
    </div>
  </Container>
);

Header.propTypes = {
  budgetId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onRefreshData: PropTypes.func.isRequired
};

export default Header;
