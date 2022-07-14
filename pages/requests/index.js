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
//import RequestRow from "../../components/RequestRow";

function RequestIndex() {
    const { Moralis, isWeb3Enabled } = useMoralis()
    const { Header, Row, HeaderCell, Body } = Table
    const [errorMessage, setErrorMessage] = useState("")

    const [openApprove, setOpenApprove] = useState(false)
    const [openFinalise, setOpenFinalise] = useState(false)
    const [vertical, setVertical] = useState("top")
    const [horizontal, setHorizontal] = useState("center")

    const [campaignAddress, setCampaignAddress] = useState("")
    const [requestsCount, setRequestsCount] = useState(0)
    const [approversCount, setApproversCount] = useState(0)
    const [requests, setRequests] = useState([])

    async function getRequest(index) {
        const options = { abi: campaignAbi.abi, contractAddress: campaignAddress }
        const requestFromCall = await Moralis.executeFunction({
            functionName: "getRequest",
            ...options,
            params: {
                index: index,
            },
        })
        return requestFromCall
    }

    async function getRequests() {
        let requests = []
        // TODO - Refactor
        if (requestsCount > 0) {
            for (let i = 0; i < requestsCount; i++) {
                const request = await getRequest(i)
                for (let j = 0; j < request.length; j++) {
                    const element = request[j]
                    if (typeof element === "object") {
                        requests.push(Number(element))
                    } else {
                        requests.push(element)
                    }
                }
            }
        }
        setRequests(requests)
    }

    async function updateUIValues(abi, address) {
        const options = { abi: abi, contractAddress: address }

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
        if (router.isReady) {
            const { address } = router.query
            setCampaignAddress(address)
            updateUIValues(campaignAbi.abi, address)
            getRequests()
            //console.log(requests)
        }
    }, [router.isReady])

    // useEffect(() => {
    //     console.log(typeof requests)
    //     console.log(requests)
    // }, [requestsCount])

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
          return (
            <RequestRow
              key={index}
              id={index}
              request={request}
              address={campaignAddress}
              approversCount={approversCount}
              updateErrorMessage={updateErrorMessage}
              updateApprovalFlag={updateApprovalFlag}
              updateFinaliseFlag={updateFinaliseFlag}
            />
          );
        });
      };

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
                    query: { address: campaignAddress },
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
                {/* <TableBody>{renderRows()}</TableBody> */}
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
