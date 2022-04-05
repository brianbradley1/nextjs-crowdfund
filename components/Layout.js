import React from "react";
import Header from "./Header";
import { Container } from "semantic-ui-react";
// next js helper function used to add files to head tag of html doc
import Head from "next/head";
import WalletConnection from "../ethereum/WalletConnection";

const Layout = (props) => {
  return (
    <Container>
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>

      <WalletConnection />
      <Header />
      {props.children}
    </Container>
  );
};
export default Layout;
