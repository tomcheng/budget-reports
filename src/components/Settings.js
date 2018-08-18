import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Section from "./Section";
import { StrongText, MinorText } from "./typeComponents";
import AccountsSelectionForm from "./AccountsSelectionForm";
import EmptyText from "./EmptyText";
import Icon from "./Icon";

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

class Settings extends Component {
  static propTypes = {
    budget: PropTypes.shape({
      accounts: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired,
    investmentAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
    mortgageAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
    onUpdateAccounts: PropTypes.func.isRequired
  };

  state = {
    editing: null
  };

  handleClickEdit = section => {
    this.setState(state => ({
      editing: state.editing === section ? null : section
    }));
  };

  handleSubmit = accountsObject => {
    const { onUpdateAccounts } = this.props;
    const { editing } = this.state;

    this.setState({ editing: null });
    onUpdateAccounts({ type: editing, value: accountsObject });
  };

  handleCancelEdit = () => {
    this.setState({ editing: null });
  };

  render() {
    const { budget, investmentAccounts, mortgageAccounts } = this.props;
    const { editing } = this.state;
    const investmentAccountsList = budget.accounts.filter(
      ({ id }) => investmentAccounts[id]
    );

    return (
      <Fragment>
        <Section>
          <SectionHeader>
            <StrongText>Investment Accounts</StrongText>
            <span
              onClick={() => {
                this.handleClickEdit("investment");
              }}
            >
              <Icon icon="pencil" />
            </span>
          </SectionHeader>
          {editing === "investment" ? (
            <AccountsSelectionForm
              accounts={budget.accounts.filter(
                account => account.type === "otherAsset" && !account.on_budget
              )}
              initialValue={investmentAccounts}
              onSubmit={this.handleSubmit}
              onCancel={this.handleCancelEdit}
            />
          ) : (
            <Fragment>
              {investmentAccountsList.length ? (
                investmentAccountsList.map(({ id, name }) => (
                  <div key={id}>{name}</div>
                ))
              ) : (
                <EmptyText>No Investment Accounts</EmptyText>
              )}
              <MinorText style={{ marginTop: 10 }}>
                Transfers to investment accounts are not counted as spending
                since it's assumed it's for retirement or some other savings
                goal.
              </MinorText>
            </Fragment>
          )}
        </Section>
        <Section>
          <SectionHeader>
            <StrongText>Mortgage Accounts</StrongText>
            <span
              onClick={() => {
                this.handleClickEdit("mortgage");
              }}
            >
              <Icon icon="pencil" />
            </span>
          </SectionHeader>
          {editing === "mortgage" ? (
            <AccountsSelectionForm
              accounts={budget.accounts}
              initialValue={mortgageAccounts}
              onSubmit={this.handleSubmit}
              onCancel={this.handleCancelEdit}
            />
          ) : (
            budget.accounts
              .filter(({ id }) => mortgageAccounts[id])
              .map(({ id, name }) => <div key={id}>{name}</div>)
          )}
        </Section>
      </Fragment>
    );
  }
}

export default Settings;
