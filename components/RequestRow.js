import React, { useState } from "react"
import { useRouter } from "next/router"
import { LoadingButton } from "@mui/lab"
import { TableCell, TableRow } from "@mui/material"
import { useWeb3Contract } from "react-moralis"
import { campaignAbi } from "./Factory"
import { ethers } from "ethers"

function RequestRow(props) {
    const [loadingApproval, setLoadingApproval] = useState(false)
    const [loadingFinalize, setLoadingFinalize] = useState(false)
    const router = useRouter()

    const { id, request, approversCount, address } = props
    //const [ description, value, recipient, complete, approvalCount ] = request;

    const readyToFinalize = request[4] > approversCount / 2

    const onApprove = async () => {
        setLoadingApproval(true)
        props.updateErrorMessage("")
        await approveRequest({
            onSuccess: handleSuccess,
            onError: handleError,
        })
    }

    const onFinalize = async () => {
        setLoadingFinalize(true)
        props.updateErrorMessage("")
        await finalizeRequest({
            onSuccess: handleSuccessFinalize,
            onError: handleError,
        })
    }

    const { runContractFunction: approveRequest } = useWeb3Contract({
        abi: campaignAbi.abi,
        contractAddress: address,
        functionName: "approveRequest",
        params: {
            index: id,
        },
    })

    const { runContractFunction: finalizeRequest } = useWeb3Contract({
        abi: campaignAbi.abi,
        contractAddress: address,
        functionName: "finalizeRequest",
        params: {
            index: id,
        },
    })

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        props.updateApprovalFlag(true)
        setLoadingApproval(false)

        setTimeout(() => {
            router.reload(router.asPath)
        }, 2000)
    }

    const handleSuccessFinalize = async (tx) => {
        await tx.wait(1)
        props.updateFinaliseFlag(true)
        setLoadingFinalize(false)

        setTimeout(() => {
            router.reload(router.asPath)
        }, 2000)
    }

    const handleError = async (error) => {
        setLoadingApproval(false)
        setLoadingFinalize(false)
        if (error.data) {
            props.updateErrorMessage(error.data.message)
        } else {
            props.updateErrorMessage(error.message)
        }
    }

    // Request[0] = Description
    // Request[1] = Value
    // Request[2] = Recipient
    // Request[3] = Complete
    // Request[4] = ApprovalCount


    return (
        <TableRow
            key={id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            disabled={request[3]}
            positive={readyToFinalize && !request[3]}
        >
            <TableCell>{id}</TableCell>
            <TableCell>{request[0]}</TableCell>
            <TableCell>{ethers.utils.formatUnits(request[1], "ether")}</TableCell>
            <TableCell>{request[2]}</TableCell>
            <TableCell>
                {request[4]}/{approversCount}
            </TableCell>
            <TableCell>
                {request[3] ? null : (
                    <LoadingButton
                        loading={loadingApproval}
                        disabled={readyToFinalize && !request[3]}
                        variant="contained"
                        onClick={onApprove}
                    >
                        Approve
                    </LoadingButton>
                )}
            </TableCell>
            <TableCell>
                {request[3] ? null : (
                    <LoadingButton
                        loading={loadingFinalize}
                        variant="contained"
                        disabled={!readyToFinalize && !request[3]}
                        onClick={onFinalize}
                    >
                        Finalise
                    </LoadingButton>
                )}
            </TableCell>
        </TableRow>
    )
}

export default RequestRow
