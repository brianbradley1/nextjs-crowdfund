import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";

class RequestRow extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    loadingApproval: false,
    loadingFinalize: false,
  };

  isReqValueGreaterThanCampaignBalance = async () => {
    const campaign = Campaign(this.props.address);

    // get campaign balance
    const summary = await campaign.methods.getSummary().call();
    const campaignBalance = summary[1];

    // get sender amount
    const requestValue = web3.utils.fromWei(this.props.request.value, "ether");

    // check if sending amount greater than remaining campaign balance
    const isGreaterThanCampaignBalance = requestValue <= campaignBalance;
    return [isGreaterThanCampaignBalance, requestValue, campaignBalance];
  };

  checkNoOfApprovers = async () => {
    const { request, approversCount } = this.props;
    return request.approvalCount > approversCount / 2;
  };

  checkIfManager = async () => {
    // get manager of contract
    const campaign = Campaign(this.props.address);
    const summary = await campaign.methods.getSummary().call();
    const manager = summary[4];

    // get requestor
    const accounts = await web3.eth.getAccounts();
    const requestor = accounts[0];

    return manager === requestor;
  };

  onApprove = async () => {
    this.setState({ loadingApproval: true });
    this.props.updateErrorMessage("");

    const isManager = await this.checkIfManager();

    try {
      if (isManager === true) {
        this.props.updateErrorMessage(
          `Manager of campaign can't be an approver`
        );
      }
      else {
        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
          from: accounts[0],
        });
      }
    } catch (err) {
      this.props.updateErrorMessage(err.message);
    }
    this.setState({ loadingApproval: false });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  onFinalize = async () => {
    this.setState({ loadingFinalize: true });
    this.props.updateErrorMessage("");

    try {
      const [isGreaterThanCampaignBalance, requestValue, campaignBalance] =
        await this.isReqValueGreaterThanCampaignBalance();

      // check to make sure min number of approvers have approved before finalizing request
      const isCorrectNoOfApprovers = await this.checkNoOfApprovers();

      const isManager = await this.checkIfManager();

      // add check to make sure request amount not > than campaign balance
      if (isGreaterThanCampaignBalance === false) {
        this.props.updateErrorMessage(
          `Request amount ${requestValue} greater than remaining campaign balance of ${campaignBalance}`
        );
      } else if (isCorrectNoOfApprovers === false) {
        this.props.updateErrorMessage(
          `Not enough approvers to finalize request. Must be greater than 50%`
        );
      } else if (isManager === false) {
        this.props.updateErrorMessage(
          `Only the manager of the campaign can finalize a request`
        );
      } else {
        const campaign = Campaign(this.props.address);

        // get campaign balance
        const summary = await campaign.methods.getSummary().call();
        const campaignBalance = summary[1];

        // get sender amount
        const requestValue = web3.utils.fromWei(
          this.props.request.value,
          "ether"
        );

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
          from: accounts[0],
        });
      }
    } catch (err) {
      this.props.updateErrorMessage(err.message);
    }
    this.setState({ loadingFinalize: false });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.loadingApproval}
              color="green"
              basic
              disabled={readyToFinalize && !request.complete}
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.loadingFinalize}
              color="teal"
              basic
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
