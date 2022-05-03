import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import { Link, Router } from "../../routes";
import Layout from "../../components/Layout";
import { LoadingButton } from "@mui/lab";

RequestNew.getInitialProps = async ({ query }) => {
  const { address } = query;
  return { address };
};

function RequestNew({ address }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    requestValue: "",
    description: "",
    receipient: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          formValues.description,
          web3.utils.toWei(formValues.requestValue, "ether"),
          formValues.receipient
        )
        .send({
          from: accounts[0],
        });

      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (err) {
      console.log(err.message);
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>
      <br />
      <br />
      <form onSubmit={onSubmit}>
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item>
            <h3>Create a request</h3>

            <Grid item>
              <TextField
                id="requestValue-input"
                name="requestValue"
                label="Request Value"
                type="text"
                value={formValues.requestValue}
                onChange={handleInputChange}
              />
            </Grid>

            <TextField
              id="description-input"
              name="description"
              label="Description"
              type="text"
              value={formValues.description}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item>
            <TextField
              id="receipient-input"
              name="receipient"
              label="Receipient"
              type="text"
              value={formValues.receipient}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item>
            <LoadingButton loading={loading} variant="contained" type="submit">
              Create
            </LoadingButton>
          </Grid>
        </Grid>
        <br />
        {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
      </form>
    </Layout>
  );
}

export default RequestNew;