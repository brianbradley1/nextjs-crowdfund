import React from "react"
import Header from "./Header"
import { Container } from "@mui/material"
// next js helper function used to add files to head tag of html doc
import Head from "next/head"

const Layout = (props) => {
    return (
        <Container>
            <Head>
                <title>Crowdfund</title>
                <meta name="description" content="Crowdfund Dapp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />

            <Header />
            <div style={{ marginTop: "120px" }}></div>
            {props.children}
        </Container>
    )
}
export default Layout
