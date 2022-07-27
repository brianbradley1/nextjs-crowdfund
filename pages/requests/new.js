import React, { useState } from "react"
import { Grid, Alert, TextField, Button } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { campaignAbi } from "../../components/Factory"
import { ethers } from "ethers"
import { regexEtherVal } from "../../utils/Regex"
import SuccessMessage from "../../components/SuccessMessage"

RequestNew.getInitialProps = async ({ query }) => {
    const { address } = query
    return { address }
}

const defaultValues = {
    requestValue: "",
    description: "",
    receipient: "",
}

function RequestNew({ address }) {
    const { Moralis, isWeb3Enabled } = useMoralis()
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [formValues, setFormValues] = useState(defaultValues)
    const [open, setOpen] = useState(false)

    const router = useRouter()

    const onSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setErrorMessage("")

        if (formValues.requestValue && formValues.description && formValues.receipient) {
            await createRequest({
                onSuccess: handleSuccess,
                onError: handleError,
            })
        } else {
            setLoading(false)
            setErrorMessage(
                ` ${formValues.requestValue ? "" : "requestValue is required, "} 
                  ${formValues.description ? "" : "description is required, "} ${
                    formValues.receipient ? "" : "receipient is required"
                }`
            )
        }
    }

    const { runContractFunction: createRequest } = useWeb3Contract({
        abi: campaignAbi.abi,
        contractAddress: address,
        functionName: "createRequest",
        params: {
            _description: formValues.description,
            _value: ethers.utils.parseEther(formValues.requestValue || "0"),
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
        console.log("error = " + error)
        if (error.data) {
            setErrorMessage(error.data.message)
        } else if (error.message) {
            setErrorMessage(error.message)
        } else if (error) {
            setErrorMessage(error)
        }
        setLoading(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name == "requestValue") {
            if (value.match(regexEtherVal)) {
                setFormValues({
                    ...formValues,
                    [name]: value,
                })
            } else {
                console.log("invalid request value")
            }
        } else {
            setFormValues({
                ...formValues,
                [name]: value,
            })
        }
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
                <SuccessMessage isOpen={open} message="Request was successfully created!" />
                <br />
                {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
            </form>
        </Layout>
    )
}

export default RequestNew
