// imports instead of require
// nodejs != emcascript / javascript
// backend js bit diff to front end js

import Head from "next/head"
import Header from "../components/Header"
import styles from "../styles/Home.module.css"
import {
    Typography,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CssBaseline,
    Grid,
    Button,
} from "@mui/material"
import Link from "next/link"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useEffect, useState } from "react"


const factoryAddresses = require("../constants/factoryAddresses.json")
const factoryAbi = require("../constants/factoryAbi.json")

export default function Home() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const factoryAddress = chainId in factoryAddresses ? factoryAddresses[chainId][0] : null
    console.log(`Chain ID = ${chainId}`)
    console.log(`Contract Address = ${factoryAddresses[chainId]}`)

    let campaigns

    /* View Functions */
    const { runContractFunction: getDeployedCampaigns } = useWeb3Contract({
        abi: factoryAbi,
        contractAddress: factoryAddress, // specify the networkId
        functionName: "getDeployedCampaigns",
        params: {},
    })

    async function getDeployedCampaignsCall() {
        campaigns = (await getDeployedCampaigns()).toString()
        console.log("Number of Campaigns " + campaigns.length)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            getDeployedCampaignsCall()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            <Head>
                <title>Crowdfund</title>
                <meta name="description" content="Crowdfund Dapp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />

            <div style={{ marginTop: "100px" }}>
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
                {/* <Grid container spacing={4}>
                    {this.props.campaigns.map((address) => (
                        <Grid item key={address} xs={12} sm={6} md={6}>
                            <Card
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardContent>
                                    <Typography gutterBottom variant="h6">
                                        {address}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Link href={`/campaigns/${address}`}>
                                        <a>View Campaign</a>
                                    </Link>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid> */}
            </div>

            {/* <footer className={styles.footer}></footer> */}
        </div>
    )
}
