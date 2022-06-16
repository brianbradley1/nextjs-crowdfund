import React, { useEffect, useState } from "react";
import web3 from "../ethereum/web3";
import { Button, ButtonGroup } from "@material-ui/core";
import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";

export default function WalletConnection() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();

  //const [network, setNetwork] = useState(null);

  // useEffect(async () => {
  //   const getNetwork = async () => {
  //     network = await web3.eth.net.getNetworkType();
  //     setNetwork(network);
  //   };

  //   if (!network) {
  //     getNetwork();
  //   }
  // }, []);

  useEffect(() => {
    if (isWeb3Enabled) {
      //updateUIValues();
    }
  }, [isWeb3Enabled]);

  // no list means it'll update everytime anything changes or happens
  // empty list means it'll run once after the initial rendering
  // and dependencies mean it'll run whenever those things in the list change

  return <ConnectButton moralisAuth={false} />;
}
