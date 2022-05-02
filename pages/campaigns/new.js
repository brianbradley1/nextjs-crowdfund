import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Link, Router } from "../../routes";
import LoadingButton from "../../components/LoadingButton";
import CreateCamaignForm from "../../components/CreateCamaignForm";


class CampaignNew extends Component {
  render() {
    return (
      <Layout>
        <CreateCamaignForm />
      </Layout>
    );
  }
}

export default CampaignNew;
