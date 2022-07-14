import React, { useState, useEffect } from "react"
import { Grid, Alert, TextField, Snackbar, Button } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { campaignAbi } from "../../components/Factory"

function RequestNew() {
    const { Moralis, isWeb3Enabled } = useMoralis()
    const [campaignAddress, setCampaignAddress] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [formValues, setFormValues] = useState({
        requestValue: "",
        description: "",
        receipient: "",
    })
    const [open, setOpen] = useState(false)
    const [vertical, setVertical] = useState("top")
    const [horizontal, setHorizontal] = useState("center")

    const router = useRouter()

    useEffect(() => {
        if (router.isReady) {
            const { address } = router.query
            setCampaignAddress(address)
            //updateUIValues(campaignAbi.abi, address)
        }
    }, [router.isReady])

    // const isReqValueGreaterThanCampaignBalance = async () => {
    //     const campaign = Campaign(address)

    //     // get campaign balance
    //     const summary = await campaign.methods.getSummary().call()
    //     const campaignBalance = web3.utils.fromWei(summary[1], "ether")

    //     // get sender amount

    //     // check if sending amount greater than remaining campaign balance
    //     const isGreaterThanCampaignBalance = formValues.requestValue > campaignBalance
    //     return [isGreaterThanCampaignBalance, formValues.requestValue, campaignBalance]
    // }

    const onSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setErrorMessage("")

        // const [isGreaterThanCampaignBalance, requestValue, campaignBalance] =
        //     await isReqValueGreaterThanCampaignBalance()

        // if (isGreaterThanCampaignBalance === true) {
        //     setErrorMessage(
        //         `Request amount ${requestValue} is greater than remaining campaign balance of ${campaignBalance}. Please enter a lower request amount`
        //     )
        // } else {

        await createRequest({
            onSuccess: handleSuccess,
            onError: handleError,
        })
    }

    const { runContractFunction: createRequest } = useWeb3Contract({
        abi: campaignAbi.abi,
        contractAddress: campaignAddress,
        functionName: "createRequest",
        params: {
            _description: formValues.description,
            _value: formValues.requestValue,
            _recipient: formValues.receipient,
        },
    })

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        setOpen(true)
        setLoading(false)

        setTimeout(() => {
            router.back()
        }, 2000)
    }

    const handleError = async (error) => {
        console.log(error.message)
        if (error.message !== undefined) {
            setErrorMessage(error.message)
        } else {
            setErrorMessage(error)
        }
        setLoading(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues({
            ...formValues,
            [name]: value,
        })
    }

    return (
        <Layout>
            <a>
                <Button color="primary" onClick={() => router.back()}>
                    Back
                </Button>
            </a>
            <form onSubmit={onSubmit}>
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    alignItems="center"
                    justifyContent="space-between"
                >
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
                    <Grid item>
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
                        Request was successfully created!
                    </Alert>
                </Snackbar>
                <br />
                {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
            </form>
        </Layout>
    )
}

export default RequestNew
