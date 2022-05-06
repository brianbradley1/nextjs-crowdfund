import React, { Component, useState } from "react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";
import { LoadingButton } from "@mui/lab";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

function RequestRow(props) {
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [loadingFinalise, setLoadingFinalise] = useState(false);
  
  const isReqValueGreaterThanCampaignBalance = async () => {
    const campaign = Campaign(props.address);

    // get campaign balance
    const summary = await campaign.methods.getSummary().call();
    const campaignBalance = summary[1];

    // get sender amount
    const requestValue = web3.utils.fromWei(props.request.value, "ether");

    // check if sending amount greater than remaining campaign balance
    const isGreaterThanCampaignBalance = requestValue <= campaignBalance;
    return [isGreaterThanCampaignBalance, requestValue, campaignBalance];
  };

  const checkNoOfApprovers = async () => {
    const { request, approversCount } = props;
    return request.approvalCount > approversCount / 2;
  };

  const checkIfManager = async () => {
    // get manager of contract
    const campaign = Campaign(props.address);
    const summary = await campaign.methods.getSummary().call();
    const manager = summary[4];

    // get requestor
    const accounts = await web3.eth.getAccounts();
    const requestor = accounts[0];

    return manager === requestor;
  };

  const onApprove = async () => {
    setLoadingApproval(true);
    props.updateErrorMessage("");

    const isManager = await checkIfManager();

    try {
      if (isManager === true) {
        props.updateErrorMessage(`Manager of campaign can't be an approver`);
      } else {
        const campaign = Campaign(props.address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(props.id).send({
          from: accounts[0],
        });
        props.updateApprovalFlag(true);
      }
    } catch (err) {
      props.updateErrorMessage(err.message);
    }
    setLoadingApproval(false);
    Router.replaceRoute(`/campaigns/${props.address}/requests`);
  };

  const onFinalize = async () => {
    setLoadingFinalise(true);
    props.updateErrorMessage("");

    try {
      const [isGreaterThanCampaignBalance, requestValue, campaignBalance] =
        await isReqValueGreaterThanCampaignBalance();

      // check to make sure min number of approvers have approved before finalizing request
      const isCorrectNoOfApprovers = await checkNoOfApprovers();

      const isManager = await checkIfManager();

      // add check to make sure request amount not > than campaign balance
      if (isGreaterThanCampaignBalance === false) {
        props.updateErrorMessage(
          `Request amount ${requestValue} greater than remaining campaign balance of ${campaignBalance}`
        );
      } else if (isCorrectNoOfApprovers === false) {
        props.updateErrorMessage(
          `Not enough approvers to finalize request. Must be greater than 50%`
        );
      } else if (isManager === false) {
        props.updateErrorMessage(
          `Only the manager of the campaign can finalize a request`
        );
      } else {
        const campaign = Campaign(props.address);

        // get campaign balance
        const summary = await campaign.methods.getSummary().call();
        const campaignBalance = summary[1];

        // get sender amount
        const requestValue = web3.utils.fromWei(props.request.value, "ether");

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(props.id).send({
          from: accounts[0],
        });
        props.updateFinaliseFlag(true);
      }
    } catch (err) {
      props.updateErrorMessage(err.message);
    }
    setLoadingFinalise(false);
    Router.replaceRoute(`/campaigns/${props.address}/requests`);
  };

  const { id, request, approversCount } = props;
  const readyToFinalize = request.approvalCount > approversCount / 2;

  return (
    <TableRow
      key={id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      disabled={request.complete}
      //positive={readyToFinalize && !request.complete}
    >
      <TableCell>{id}</TableCell>
      <TableCell>{request.description}</TableCell>
      <TableCell>{web3.utils.fromWei(request.value, "ether")}</TableCell>
      <TableCell>{request.recipient}</TableCell>
      <TableCell>
        {request.approvalCount}/{approversCount}
      </TableCell>
      <TableCell>
        {request.complete ? null : (
          <LoadingButton
            loading={loadingApproval}
            disabled={readyToFinalize && !request.complete}
            variant="contained"
            onClick={onApprove}
          >
            Approve
          </LoadingButton>
        )}
      </TableCell>
      <TableCell>
        {request.complete ? null : (
          <LoadingButton
            loading={loadingFinalise}
            variant="contained"
            onClick={onFinalize}
          >
            Finalise
          </LoadingButton>
        )}
      </TableCell>
    </TableRow>
  );
}

export default RequestRow;
