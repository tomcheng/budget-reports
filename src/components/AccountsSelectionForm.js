import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import omit from "lodash/fp/omit";
import { PrimaryButton, GhostButton } from "./Button";

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 5px 0;
`;

class AccountsSelectionForm extends Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    initialValue: PropTypes.objectOf(PropTypes.bool).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super();
    this.state = { value: props.initialValue };
  }

  handleChange = evt => {
    const { name, checked } = evt.target;

    this.setState(state => ({
      ...state,
      value: checked
        ? {
            ...state.value,
            [name]: true
          }
        : omit(name)(state.value)
    }));
  };

  handleClickSubmit = () => {
    this.props.onSubmit(this.state.value);
  };

  render() {
    const { accounts, onCancel } = this.props;
    const { value } = this.state;

    return (
      <Fragment>
        {accounts.map(({ id, name }) => (
          <StyledLabel key={id}>
            <input
              type="checkbox"
              checked={!!value[id]}
              name={id}
              onChange={this.handleChange}
            />&nbsp;
            {name}
          </StyledLabel>
        ))}
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 5 }}
        >
          <GhostButton onClick={onCancel}>cancel</GhostButton>
          <PrimaryButton onClick={this.handleClickSubmit}>Submit</PrimaryButton>
        </div>
      </Fragment>
    );
  }
}

export default AccountsSelectionForm;
