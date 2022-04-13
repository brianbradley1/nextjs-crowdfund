import React, { Component } from "react";
//import  from "react/cjs/react.production.min";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes";

class CampaignIndex extends Component {
  // exclusive method to next js
  // use static keyword so can fetch data without rendering component
  static async getInitialProps() {
    //console.log("Index. GetInitialProps = " + process.env.DEPLOYED_CONTRACT_ADDRESS);
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  // traditionally acceptable to fetch data in below method
  // async componentDidMount() {
  // }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        // property below allows card to stretch from left to right
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div style={{ marginTop: 120 }}>
          <h3>Open Campaigns</h3>

          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add"
                primary
              />
            </a>
          </Link>

          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
