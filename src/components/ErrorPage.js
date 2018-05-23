import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 10px 20px;
`;


const ErrorPage = ({ message }) => (
  <Container>
    <h3>{message}</h3>
    <div>
      <Link to="/">Home</Link>
    </div>
  </Container>
);

ErrorPage.propTypes = {
  message: PropTypes.string.isRequired
};

export default ErrorPage;
