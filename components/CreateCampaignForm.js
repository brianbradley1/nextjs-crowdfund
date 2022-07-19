import React, { useState } from "react"
import { Grid, TextField, Snackbar, Alert } from "@mui/material"
import Router from "next/router"
import { LoadingButton } from "@mui/lab"
import { factoryAddresses, factoryAbi } from "../components/Factory"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { ethers } from "ethers"

function CreateCampaignForm() {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [open, setOpen] = useState(false)
    const [vertical, setVertical] = useState("top")
    const [horizontal, setHorizontal] = useState("center")
    const [minimumContribution, setMinimumContribution] = useState("")

    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const factoryAddress = chainId in factoryAddresses ? factoryAddresses[chainId][0] : null

    const onSubmit = async (event) => {
        const options = { abi: factoryAbi, contractAddress: factoryAddress }
        event.preventDefault()
        setErrorMessage("")
        setLoading(true)

        await createCampaign({
            onSuccess: handleSuccess,
            onError: handleError,
        })
    }

    const { runContractFunction: createCampaign } = useWeb3Contract({
        abi: factoryAbi,
        contractAddress: factoryAddress,
        functionName: "createCampaign",
        params: {
            minimum: ethers.utils.parseEther(minimumContribution || "0"),
        },
    })

    const handleInputChange = (e) => {
        setMinimumContribution(e.target.value)
    }

    const handleSuccess = async (tx) => {
        console.log("success")
        await tx.wait(1)
        setOpen(true)
        setLoading(false)
        setTimeout(() => {
            Router.push("/")
        }, 3000)
    }

    const handleError = async (error) => {
        console.log("error = " + error)
        if (error.data) {
            setErrorMessage(error.data.message)
        } else if (error) {
            setErrorMessage(error.message)
        }
        setLoading(false)
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
                        value={minimumContribution}
                        onChange={handleInputChange}
                    />
                </Grid>

                <Grid item>
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        type="submit"
                        loading={loading}
                        onClick={onSubmit}
                    >
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
                <Alert onClose={() => setOpen(false)} severity="success">
                    Campaign was successfully created!
                </Alert>
            </Snackbar>
            <br />
            {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
        </form>
    )
}
export default CreateCampaignForm
