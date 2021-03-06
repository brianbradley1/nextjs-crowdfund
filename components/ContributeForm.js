import React, { useState } from "react"
import { Grid, TextField, Alert } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { campaignAbi } from "./Factory"
import { useRouter } from "next/router"
import { ethers } from "ethers"
import { regexEtherVal } from "../utils/Regex"
import SuccessMessage from "./SuccessMessage"

function ContributeForm({ address }) {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [contribution, setContributionValue] = useState("")
    const [open, setOpen] = useState(false)

    const router = useRouter()

    const onSubmit = async (event) => {
        event.preventDefault()
        setErrorMessage("")
        setLoading(true)

        if (contribution) {
            await contribute({
                onSuccess: handleSuccess,
                onError: handleError,
            })
        } else {
            setLoading(false)
            setErrorMessage(`${contribution ? "" : "contribution is required"}`)
        }
    }

    const { runContractFunction: contribute } = useWeb3Contract({
        abi: campaignAbi.abi,
        contractAddress: address,
        functionName: "contribute",
        msgValue: ethers.utils.parseEther(contribution || "0"),
        params: {},
    })

    const handleInputChange = (e) => {
        if (e.target.value.match(regexEtherVal)) setContributionValue(e.target.value)
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        setOpen(true)
        setLoading(false)

        setTimeout(() => {
            router.replace(router.asPath)
        }, 2000)
    }

    const handleError = async (error) => {
        if (error.data) {
            setErrorMessage(error.data.message)
        } else if (error.message) {
            setErrorMessage(error.message)
        } else if (error) {
            setErrorMessage(error)
        }
        setLoading(false)
    }

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
            <SuccessMessage isOpen={open} message="You have successfully contributed to this campaign!" />
            <br />
            {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
        </form>
    )
}

export default ContributeForm
