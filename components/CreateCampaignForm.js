import React, { useState } from "react"
import { Grid, Button, TextField, Snackbar } from "@mui/material"
//import { Router } from "../routes";
import { LoadingButton, Alert } from "@mui/lab"
import { factoryAddresses, factoryAbi, campaignAbi } from "../components/Factory"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { ethers } from "ethers"

const defaultValues = {
    minimumContribution: "",
}

// createCampaign doesnt exist? Maybe need to add campaign abi....

function CreateCampaignForm() {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [formValues, setFormValues] = useState(defaultValues)
    const [open, setOpen] = useState(false)
    const [vertical, setVertical] = useState("top")
    const [horizontal, setHorizontal] = useState("center")

    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const factoryAddress = chainId in factoryAddresses ? factoryAddresses[chainId][0] : null

    //     setErrorMessage("")
    //     setLoading(true)

    const { runContractFunction: createCampaign } = useWeb3Contract({
        abi: factoryAbi,
        contractAddress: factoryAddress,
        functionName: "createCampaign",
        params: {
            minimum: formValues.minimumContribution,
        },
    })

    /* View Functions */

    // Will need to get the deployed campaigns first

    // try {
    //   const accounts = await web3.eth.getAccounts();

    //   await factory.methods
    //     .createCampaign(
    //       web3.utils.toWei(formValues.minimumContribution, "ether")
    //     )
    //     .send({
    //       from: accounts[0],
    //     });

    //   setOpen(true);
    //   setTimeout(() => {
    //     Router.pushRoute("/");
    //   }, 3000);
    // } catch (err) {
    //   setLoading(false);
    //   setErrorMessage(err.message);
    // }
    //setLoading(false)
    //}

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues({
            ...formValues,
            [name]: value,
        })
    }

    //Probably could add some error handling
    const handleSuccess = async (tx) => {
        await tx.wait(1)
        console.log("campaign was created")
        //updateUIValues()
        //handleNewNotification(tx)
    }

    return (
        <form>
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
                    {/* <LoadingButton variant="contained" type="submit">
            Create
          </LoadingButton> */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () =>
                            // try and refactor this be adding an event (18hr 03min)
                            await createCampaign({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                    >
                        Create
                    </Button>
                </Grid>
            </Grid>
            {/* <Snackbar
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
      {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>} */}
        </form>
    )
}
export default CreateCampaignForm
