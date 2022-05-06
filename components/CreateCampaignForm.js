import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
import { LoadingButton } from "@mui/lab";
import Snackbar from "@mui/material/Snackbar";

const defaultValues = {
  minimumContribution: "",
};

function CreateCampaignForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [vertical, setVertical] = useState('top');
  const [horizontal, setHorizontal] = useState('center');

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

      setOpen(true);
      setTimeout(() => {
        Router.pushRoute("/");
      }, 3000);
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
          <LoadingButton loading={loading} variant="contained" type="submit">
            Create
          </LoadingButton>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: vertical,
          horizontal: horizontal,
        }}
        open={open}
        autoHideDuration={3000}
        key={vertical + horizontal}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
        >
          Campaign was successfully created!
        </Alert>
      </Snackbar>
      <br />
      {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
    </form>
  );
}
export default CreateCampaignForm;
