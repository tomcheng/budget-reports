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

const Actions = styled.div`
  text-align: right;
`;

const UpdatedText = styled.div`
  color: #888;
  font-size: 11px;
  line-height: 18px;
  margin-top: 2px;
`;

const Header = ({ title, onRefreshData, budgetId }) => (
  <Container>
    <Title>{title}</Title>
    <Actions>
      <button
        onClick={() => {
          onRefreshData(budgetId);
        }}
      >
        Refresh
      </button>
      <UpdatedText>
        Updated{" "}
        {moment(getLastUpdated(budgetId) || undefined).fromNow()}
      </UpdatedText>
    </Actions>
  </Container>
);

Header.propTypes = {
  budgetId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onRefreshData: PropTypes.func.isRequired
};

export default Header;
