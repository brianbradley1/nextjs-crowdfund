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

    const { id, description, value, recipient, complete, approvalCount, approversCount, address } =
        props
    const readyToFinalize = approvalCount > approversCount / 2

    const onApprove = async () => {
        setLoadingApproval(true)
        props.updateErrorMessage("")
        await approveRequest({
            onSuccess: handleSuccessApprove,
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

    const handleSuccessApprove = async (tx) => {
        await tx.wait(1)
        props.updateApprovalFlag(true)
        setLoadingApproval(false)

        setTimeout(() => {
            router.replace(router.asPath)
        }, 2000)
    }

    const handleSuccessFinalize = async (tx) => {
        await tx.wait(1)
        props.updateFinaliseFlag(true)
        setLoadingFinalize(false)

        setTimeout(() => {
            router.replace(router.asPath)
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

    return (
        <TableRow
            key={id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            disabled={description}
            positive={readyToFinalize && !complete}
        >
            <TableCell>{id}</TableCell>
            <TableCell>{description}</TableCell>
            <TableCell>{ethers.utils.formatUnits(value.toString(), "ether")}</TableCell>
            <TableCell>{recipient}</TableCell>
            <TableCell>
                {approvalCount}/{approversCount}
            </TableCell>
            <TableCell>
                {complete ? null : (
                    <LoadingButton
                        loading={loadingApproval}
                        disabled={readyToFinalize && !complete}
                        variant="contained"
                        onClick={onApprove}
                    >
                        Approve
                    </LoadingButton>
                )}
            </TableCell>
            <TableCell>
                {complete ? null : (
                    <LoadingButton
                        loading={loadingFinalize}
                        variant="contained"
                        disabled={!readyToFinalize && !complete}
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
