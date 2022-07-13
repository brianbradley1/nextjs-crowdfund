import React from "react"
import { useEffect, useState } from "react"
import Layout from "../../components/Layout"
import Link from "next/link"
import { Card, CardContent, Typography, Grid } from "@mui/material"
import { useMoralis } from "react-moralis"
import { campaignAbi } from "../../components/Factory"
import { useRouter } from "next/router"
import { ethers } from "ethers"

function CampaignShow() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const router = useRouter()

    const [campaignAddress, setCampaignAddress] = useState("")
    const [manager, setManager] = useState("")
    const [minimumContribution, setMinimumContribution] = useState("")
    const [requestsCount, setRequestsCount] = useState(0)
    const [approversCount, setApproversCount] = useState(0)
    const [contractBalance, setContractBalance] = useState(0)

    async function updateUIValues(abi, address) {
        const options = { abi: abi, contractAddress: address }

        /* View Functions */
        const managerFromCall = await Moralis.executeFunction({
            functionName: "getManager",
            ...options,
        })
        const minContribuitionFromCall = await Moralis.executeFunction({
            functionName: "getMinimumContribution",
            ...options,
        })
        const requestsCountFromCall = await Moralis.executeFunction({
            functionName: "getRequestCount",
            ...options,
        })
        const approversCountFromCall = await Moralis.executeFunction({
            functionName: "getNumApprovers",
            ...options,
        })
        const contractBalanceFromCall = await Moralis.executeFunction({
            functionName: "getBalance",
            ...options,
        })
        setManager(managerFromCall)
        setMinimumContribution(Number(minContribuitionFromCall))
        setRequestsCount(Number(requestsCountFromCall))
        setApproversCount(Number(approversCountFromCall))
        setContractBalance(Number(contractBalanceFromCall))
    }

    useEffect(() => {
        if (router.isReady && isWeb3Enabled) {
            const { address } = router.query
            setCampaignAddress(address)
            updateUIValues(campaignAbi.abi, address)
        }
    }, [router.isReady, isWeb3Enabled])

    const renderCards = () => {
        const items = [
            {
                id: 1,
                header: manager,
                meta: "Managers Address",
                description: "The manager created this campaign and can create requests",
                style: { overflowWrap: "break-word" },
            },
            {
                id: 2,
                header: minimumContribution,
                meta: "Minimum Contribution (ether)",
                description: "You must contribute at least this much ether and be an approver",
            },
            {
                id: 3,
                header: requestsCount,
                meta: "Number of Requests",
                description:
                    "A request tries to withdraw money from the contract. Requests must be approved be more than 50% of approvers",
            },
            {
                id: 4,
                header: approversCount,
                meta: "Number of Approvers",
                description: "Number of people who have already contributed to this campaign",
            },
            {
                id: 5,
                header: contractBalance,
                meta: "Campaign Balance (ether)",
                description: "Balance this campaign has left to spend",
            },
        ]

        return items.map((item) => {
            return (
                <Card key={item.id} sx={{ minWidth: 275, margin: "10px" }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            {item.meta} - {item.header}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: 15 }}>
                            {item.description}
                        </Typography>
                    </CardContent>
                </Card>
            )
        })
    }

    return (
        <Layout>
            <h3>Campaign Show</h3>

            <Grid
                container
                spacing={6}
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
            >
                <Grid item xs={8}>
                    {renderCards()}
                </Grid>
                <Grid item xs={4}>
                    {/* <ContributeForm address={campaignAddress} /> */}
                </Grid>
            </Grid>

            <br />
            {/* <Link route={`/campaigns/${campaignAddress}/requests`}>
                <a>
                    <Button variant="contained" color="primary">
                        View Requests
                    </Button>
                </a>
            </Link> */}
        </Layout>
    )
}

export default CampaignShow
