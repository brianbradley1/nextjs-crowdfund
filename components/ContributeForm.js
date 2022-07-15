import React, { useState } from "react"
import { Grid, TextField, Snackbar, Alert } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { campaignAbi } from "./Factory"
import { useRouter } from "next/router"

function ContributeForm({ address }) {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [contribution, setContributionValue] = useState("")
    const [open, setOpen] = useState(false)
    const [vertical, setVertical] = useState("top")
    const [horizontal, setHorizontal] = useState("center")

    const router = useRouter()

    const onSubmit = async (event) => {
        event.preventDefault()
        setErrorMessage("")
        setLoading(true)

        await contribute({
            onSuccess: handleSuccess,
            onError: handleError,
        })
    }

    const { runContractFunction: contribute } = useWeb3Contract({
        abi: campaignAbi.abi,
        contractAddress: address,
        functionName: "contribute",
        msgValue: contribution,
        params: {},
    })

    const handleInputChange = (e) => {
        const eventVal = e.target.value
        setContributionValue(eventVal)
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        setOpen(true)
        setLoading(false)

        setTimeout(() => {
            router.reload(router.asPath)
        }, 2000)
    }

    const handleError = async (error) => {
        if (error.data) {
            setErrorMessage(error.data.message)
        } else {
            setErrorMessage(error.message)
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
                    You have successfully contributed to this campaign!
                </Alert>
            </Snackbar>
            <br />
            {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
        </form>
    )
}

export default ContributeForm
