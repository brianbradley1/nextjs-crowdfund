import { Router } from "../routes";
import React, { useState } from "react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import { LoadingButton } from "@mui/lab";

function ContributeForm({ address }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [contribution, setContributionValue] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(address);

    setErrorMessage("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      console.log("Submitting form")
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, "ether"),
      });

      Router.replaceRoute(`/campaigns/${address}`);
    } catch (err) {
      console.log(err.message)
      setLoading(false);
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const eventVal = e.target.value;
    setContributionValue(eventVal);
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <h3>Amount to contribute</h3>

          <TextField
            id="contributionValue-input"
            name="contributionValue"
            label="ether"
            type="text"
            value={contribution}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item>
          <LoadingButton loading={loading} variant="contained" type="submit">
            Contribute
          </LoadingButton>
        </Grid>
      </Grid>
      <br />
      {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
    </form>
  );
}

export default ContributeForm;
