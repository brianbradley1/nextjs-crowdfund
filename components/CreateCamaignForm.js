import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
import { LoadingButton } from '@mui/lab';

const defaultValues = {
  minimumContribution: "",
};

function CreateCamaignForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState(defaultValues);

  const onSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createCampaign(
          web3.utils.toWei(formValues.minimumContribution, "ether")
        )
        .send({
          from: accounts[0],
        });

      Router.pushRoute("/");
    } catch (err) {
      setLoading(false);
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
    <form onSubmit={onSubmit}>
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          <h3>Create a Campaign</h3>

          <TextField
            id="minimumContribution-input"
            name="minimumContribution"
            label="ether"
            type="text"
            value={formValues.minimumContribution}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item>
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
          >
            Create
          </LoadingButton>
        </Grid>
      </Grid>
      <br />
      {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
    </form>
  );
}
export default CreateCamaignForm;
