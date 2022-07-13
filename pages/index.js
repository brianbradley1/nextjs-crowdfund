import { Typography, Card, CardActions, CardContent, Grid, Button, Container } from "@mui/material"
import Link from "next/link"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useEffect } from "react"
import { factoryAddresses, factoryAbi } from "../components/Factory"
import Layout from "../components/Layout"

let campaigns

function Home() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const address = chainId in factoryAddresses ? factoryAddresses[chainId][0] : null

    /* View Functions */
    const { runContractFunction: getDeployedCampaigns } = useWeb3Contract({
        abi: factoryAbi,
        contractAddress: address, // specify the networkId
        functionName: "getDeployedCampaigns",
        params: {},
    })

    async function getDeployedCampaignsCall() {
        campaigns = await getDeployedCampaigns()
        console.log(`Number of campaigns = ${campaigns}`)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            getDeployedCampaignsCall()
        }
    }, [isWeb3Enabled])

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
                            {campaigns?.map((address) => (
                                <Grid item key={address} xs={12} sm={6} md={6}>
                                    <Card
                                        style={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <CardContent>
                                            <Typography gutterBottom variant="h7">
                                                {address}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Link
                                                href={{
                                                    pathname: "/campaigns/show/",
                                                    query: { address: address },
                                                }}
                                            >
                                                <a style={{ textDecoration: "none" }}>
                                                    View Campaign
                                                </a>
                                            </Link>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </div>

                {/* <footer className={styles.footer}></footer> */}
            </Layout>
        </div>
    )
}

export default Home
