import React, { Component } from "react";
import Layout from "../../components/Layout";
import CreateCampaignForm from "../../components/CreateCampaignForm";

class CampaignNew extends Component {
  render() {
    return (
      <Layout>
        <CreateCampaignForm />
      </Layout>
    );
  }
}

export default CampaignNew;
