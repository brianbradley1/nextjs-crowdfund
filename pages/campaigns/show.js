import React from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";

CampaignShow.getInitialProps = async ({ query }) => {
  const { address } = query;
  const campaign = Campaign(address); // address trying to access via route
  const summary = await campaign.methods.getSummary().call();

  return {
    address: address,
    minimumContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
  };
};

function CampaignShow({
  address,
  minimumContribution,
  balance,
  requestsCount,
  approversCount,
  manager,
}) {
  const renderCards = () => {
    const items = [
      {
        id: 1,
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests",
        style: { overflowWrap: "break-word" },
      },
      {
        id: 2,
        header: web3.utils.fromWei(minimumContribution, "ether"),
        meta: "Minimum Contribution (ether)",
        description:
          "You must contribute at least this much ether and be an approver",
      },
      {
        id: 3,
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved be more than 50% of approvers",
      },
      {
        id: 4,
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already contributed to this campaign",
      },
      {
        id: 5,
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description: "Balance this campaign has left to spend",
      },
    ];

    return items.map((item) => {
      return (
        <Card key={item.id} sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {item.meta} - {item.header}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 20 }}>
              {item.description}
            </Typography>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <Layout>
      <h3>Campaign Show</h3>

      <Grid
        container
        spacing={6}
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Grid item xs={8}>
          {renderCards()}
        </Grid>
        <Grid item xs={4}>
          <ContributeForm address={address} />
        </Grid>
      </Grid>

      <br />
      <Link route={`/campaigns/${address}/requests`}>
        <a>
          <Button variant="contained" color="primary">
            View Requests
          </Button>
        </a>
      </Link>
    </Layout>
  );
}

export default CampaignShow;
