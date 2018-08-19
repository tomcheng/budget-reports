import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Section from "./Section";
import { StrongText, MinorText } from "./typeComponents";
import AccountsSelectionForm from "./AccountsSelectionForm";
import Modal from "./Modal";
import EmptyText from "./EmptyText";
import Icon from "./Icon";

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Space = styled.div`
  height: 20px;
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
    investmentModalOpen: false,
    mortgageModalOpen: false
  };

  handleClickEdit = section => {
    if (section === "investment") {
      this.setState({ investmentModalOpen: true });
    }
    if (section === "mortgage") {
      this.setState({ mortgageModalOpen: true });
    }
  };

  handleCloseInvestmentModal = () => {
    this.setState({ investmentModalOpen: false });
  };

  handleCloseMortgageModal = () => {
    this.setState({ mortgageModalOpen: false });
  };

  handleChangeInvestment = accountsObject => {
    this.props.onUpdateAccounts({ type: "investment", value: accountsObject });
  };

  handleChangeMortgage = accountsObject => {
    this.props.onUpdateAccounts({ type: "mortgage", value: accountsObject });
  };

  render() {
    const { budget, investmentAccounts, mortgageAccounts } = this.props;
    const { investmentModalOpen, mortgageModalOpen } = this.state;

    const potentialInvestmentAccounts = budget.accounts.filter(
      account => account.type === "otherAsset" && !account.on_budget
    );
    const potentialMortageAccounts = budget.accounts.filter(
      account => account.type === "otherLiability" && !account.on_budget
    );
    const investmentAccountsList = budget.accounts.filter(
      ({ id }) => investmentAccounts[id]
    );
    const mortgageAccountList = budget.accounts.filter(
      ({ id }) => mortgageAccounts[id]
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
          {investmentAccountsList.length ? (
            investmentAccountsList.map(({ id, name }) => (
              <div key={id}>{name}</div>
            ))
          ) : (
            <EmptyText>No accounts marked as investment</EmptyText>
          )}
          <MinorText style={{ marginTop: 10 }}>
            Transfers to investment accounts are not counted as spending since
            it's assumed it's for retirement or some other savings goal.
          </MinorText>
          <Modal
            open={investmentModalOpen}
            onClose={this.handleCloseInvestmentModal}
            title="Investment Accounts"
          >
            <AccountsSelectionForm
              accounts={potentialInvestmentAccounts}
              value={investmentAccounts}
              onChange={this.handleChangeInvestment}
            />
          </Modal>
          <Space />
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
          {mortgageAccountList.length ? (
            mortgageAccountList.map(({ id, name }) => (
              <div key={id}>{name}</div>
            ))
          ) : (
            <EmptyText>No accounts marked as mortgage</EmptyText>
          )}
          <Modal
            open={mortgageModalOpen}
            onClose={this.handleCloseMortgageModal}
            title="Mortgage Account"
          >
            <AccountsSelectionForm
              accounts={potentialMortageAccounts}
              value={mortgageAccounts}
              onChange={this.handleChangeMortgage}
            />
          </Modal>
        </Section>
      </Fragment>
    );
  }
}

export default Settings;
