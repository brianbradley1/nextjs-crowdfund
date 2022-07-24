import React, { useState, useEffect } from "react"
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Alert,
    Snackbar,
} from "@mui/material"
import Layout from "../../components/Layout"
import Link from "next/link"
import { useRouter } from "next/router"
import { campaignAbi } from "../../components/Factory"
import { useWeb3Contract, useMoralis } from "react-moralis"
import RequestRow from "../../components/RequestRow"

RequestIndex.getInitialProps = async ({ query }) => {
    const { address } = query
    return { address }
}

function RequestIndex({ address }) {
    const { Moralis, isWeb3Enabled } = useMoralis()
    const { Header, Row, HeaderCell, Body } = Table
    const [errorMessage, setErrorMessage] = useState("")

    const [openApprove, setOpenApprove] = useState(false)
    const [openFinalise, setOpenFinalise] = useState(false)
    const [vertical, setVertical] = useState("top")
    const [horizontal, setHorizontal] = useState("center")

    const [requestsCount, setRequestsCount] = useState(0)
    const [approversCount, setApproversCount] = useState(0)
    const [requests, setRequests] = useState([])
    const options = { abi: campaignAbi.abi, contractAddress: address }

    async function getRequest(index) {
        // TODO - Refactor options
        const requestFromCall = await Moralis.executeFunction({
            functionName: "getRequest",
            ...options,
            params: {
                index: index,
            },
        })
        return requestFromCall
    }

    async function setRequestFunction() {
        let requestArr = []
        let requestNew = []
        if (requestsCount > 0) {
            for (let i = 0; i < requestsCount; i++) {
                requestArr = []
                const request = await getRequest(i)
                for (let j = 0; j < request.length; j++) {
                    const element = request[j]
                    requestArr.push(element)
                }
                // convert array items to obj format
                var requestObj = requestArr.reduce(function (acc, cur, i) {
                    acc[i] = cur
                    return acc
                }, {})
                requestNew.push(requestObj)
            }
            setRequests(requestNew)
        }
    }

    async function updateUIValues(abi, address) {
        /* View Functions */
        const requestsCountFromCall = await Moralis.executeFunction({
            functionName: "getRequestCount",
            ...options,
        })
        const approversCountFromCall = await Moralis.executeFunction({
            functionName: "getNumApprovers",
            ...options,
        })
        setRequestsCount(Number(requestsCountFromCall))
        setApproversCount(Number(approversCountFromCall))
    }

    const router = useRouter()

    useEffect(() => {
        if (isWeb3Enabled) {
            const { address } = router.query
            updateUIValues(campaignAbi.abi, address)
            setRequestFunction()
        }
    }, [requestsCount, isWeb3Enabled, router])

    // Create callback function and pass to RequestRow (child) as props
    // Child component will call this and pass data back to parent
    const updateErrorMessage = (childData) => {
        setErrorMessage(childData)
    }

    const updateApprovalFlag = (childData) => {
        setOpenApprove(childData)
    }

    const updateFinaliseFlag = (childData) => {
        setOpenFinalise(childData)
    }

    const renderRows = () => {

        return requests.map((request, index) => {
            const { 0: description, 1: value, 2: recipient, 3: complete, 4: approvalCount } = request;

            console.log(request)
            return (
                <RequestRow
                    key={index}
                    id={index}
                    description={description}
                    value={value}
                    recipient={recipient}
                    complete={complete}
                    approvalCount={Number(approvalCount)}
                    address={address}
                    approversCount={approversCount}
                    updateErrorMessage={updateErrorMessage}
                    updateApprovalFlag={updateApprovalFlag}
                    updateFinaliseFlag={updateFinaliseFlag}
                />
            )
        })
    }

    return (
        <Layout>
            <a>
                <Button color="primary" onClick={() => router.back()}>
                    Back
                </Button>
            </a>
            <Link
                href={{
                    pathname: "/requests/new",
                    query: { address: address },
                }}
            >
                <a>
                    <Button variant="contained" color="primary" style={{ float: "right" }}>
                        Add Request
                    </Button>
                </a>
            </Link>
            <h3>Requests</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Recipient</TableCell>
                        <TableCell>Approval Count</TableCell>
                        <TableCell>Approve</TableCell>
                        <TableCell>Finalize</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{renderRows()}</TableBody>
            </Table>
            <div>Found {requestsCount} requests.</div>{" "}
            <Snackbar
                anchorOrigin={{
                    vertical: vertical,
                    horizontal: horizontal,
                }}
                open={openApprove}
                autoHideDuration={3000}
                key={vertical + horizontal + "1"}
            >
                <Alert onClose={() => setOpenApprove(false)} severity="success">
                    Request was successfully approved!
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{
                    vertical: vertical,
                    horizontal: horizontal,
                }}
                open={openFinalise}
                autoHideDuration={3000}
                key={vertical + horizontal + "2"}
            >
                <Alert onClose={() => setOpenFinalise(false)} severity="success">
                    Request was successfully finalised!
                </Alert>
            </Snackbar>
            <br />
            {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
        </Layout>
    )
}

export default RequestIndex
