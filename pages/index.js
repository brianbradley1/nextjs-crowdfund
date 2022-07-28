import {
    Typography,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Button,
    Container,
} from "@mui/material"
import Link from "next/link"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { factoryAddresses, factoryAbi, campaignAbi } from "../components/Factory"
import Layout from "../components/Layout"
import { useRouter } from "next/router"

export default function Home() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const address = chainId in factoryAddresses ? factoryAddresses[chainId][0] : null

    const [campaigns, setCampaigns] = useState([])
    const [campaignsCount, setCampaignsCount] = useState(0)

    const router = useRouter()

    async function getCampaignsCountCall() {
        const campaignCountFromCall = await Moralis.executeFunction({
            functionName: "getCampaignsCount",
            abi: factoryAbi,
            contractAddress: address,
        })
        console.log("campaign count = " + campaignCountFromCall)
        setCampaignsCount(Number(campaignCountFromCall))
    }

    async function getCampaign(index) {
        const campaignFromCall = await Moralis.executeFunction({
            functionName: "getCampaign",
            abi: factoryAbi,
            contractAddress: address,
            params: {
                _id: index,
            },
        })
        return campaignFromCall
    }

    async function setCampaignFunction() {
        let campaignArr = []
        let campaignNew = []
        if (campaignsCount > 0) {
            for (let i = 1; i <= campaignsCount; i++) {
                campaignArr = []
                const campaign = await getCampaign(i)
                for (let j = 0; j < campaign.length; j++) {
                    const element = campaign[j]
                    campaignArr.push(element)
                }
                var campaignObj = campaignArr.reduce(function (acc, cur, i) {
                    acc[i] = cur
                    return acc
                }, {})
                campaignNew.push(campaignObj)
            }
            setCampaigns(campaignNew)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            getCampaignsCountCall()
            setCampaignFunction()
        }
    }, [isWeb3Enabled, campaignsCount])

    const renderRows = () => {
        return campaigns?.map((campaign, index) => {
            const { 0: id, 1: address, 2: title, 3: description } = campaign

            return (
                <Grid item key={address} xs={12} sm={6} md={6}>
                    <Card
                        style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h7">
                                Campaign {Number(id)} - {title}
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography gutterBottom variant="h7">
                                {description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Link
                                href={{
                                    pathname: "/campaigns/show/",
                                    query: { address: address },
                                }}
                            >
                                <a style={{ textDecoration: "none" }}>View Campaign</a>
                            </Link>
                        </CardActions>
                    </Card>
                </Grid>
            )
        })
    }

    return (
        <div>
            <Layout>
                <div>
                    <Typography variant="h3" align="center">
                        Open Campaigns
                    </Typography>
                    <div style={{ marginTop: "40px" }}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Link href="/campaigns/new">
                                    <Button variant="contained" color="primary">
                                        Create Campaign
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </div>

                <div>
                    <Container style={{ padding: "20px 0" }} maxWidth="md">
                        <Grid container spacing={4}>
                            {renderRows()}
                        </Grid>
                    </Container>
                </div>
            </Layout>
        </div>
    )
}
