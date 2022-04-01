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

  onApprove = async () => {
    this.setState({ loadingApproval: true });
    this.props.updateErrorMessage("");

    try {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });
    } catch (err) {
      this.props.updateErrorMessage(err.message);
    }
    this.setState({ loadingApproval: false });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  isReqValueGreaterThanCampaignBalance = async () => {
    const campaign = Campaign(this.props.address);

    // get campaign balance
    const summary = await campaign.methods.getSummary().call();
    const campaignBalance = summary[1];

    // get sender amount
    const requestValue = web3.utils.fromWei(this.props.request.value, "ether");

    // check if sending amount greater than remaining campaign balance
    const result = requestValue <= campaignBalance;
    return [result, requestValue, campaignBalance];
  };

  onFinalize = async () => {
    this.setState({ loadingFinalize: true });
    this.props.updateErrorMessage("");

    try {
      const [result, requestValue, campaignBalance] =
        await this.isReqValueGreaterThanCampaignBalance();

      // // add check to make sure request amount not > than campaign balance
      if (result === false) {
        this.props.updateErrorMessage(
          `Request amount ${requestValue} greater than remaining campaign balance of ${campaignBalance}`
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
