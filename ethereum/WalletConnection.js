import React, { useEffect, useState } from "react";
import { useWallet, UseWalletProvider } from "use-wallet";
import web3 from "../ethereum/web3";
import { Button, ButtonGroup } from "@material-ui/core";

function WalletConnection() {
  const [network, setNetwork] = useState(null);

  useEffect(async () => {
    const getNetwork = async () => {
      network = await web3.eth.net.getNetworkType();
      setNetwork(network);
    };

    if (!network) {
      getNetwork();
    }
  }, []);

  //console.log("Network outside useEffect = " + network);

  const wallet = useWallet();

  // const connectWallet = async (e) => {
  //   e.preventDefault();
  //   await wallet.connect();
  // };

  let balance = web3.utils.fromWei(wallet.balance, "ether");
  balance = Number(balance).toFixed(4);

  return (
    <>
      {wallet.status === "connected" ? (
        <div style={{ float: "right", marginLeft: "10px" }}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button>Account: {wallet.account}</Button>
            <Button>Balance: {balance}</Button>
            <Button>Network: {network}</Button>
          </ButtonGroup>
          <Button
            style={{ backgroundColor: "orange", color: "black" }}
            onClick={() => wallet.reset()}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <div style={{ float: "right", marginLeft: "10px" }}>
          <Button
            style={{ backgroundColor: "orange", color: "black" }}
            onClick={() => wallet.connect()}
          >
            Connect Wallet
          </Button>
        </div>
      )}
    </>
  );
}

// Wrap everything in <UseWalletProvider />
export default () => (
  <UseWalletProvider
    chainId={4}
    connectors={{
      // This is how connectors get configured
      provided: { provider: web3 },
    }}
  >
    <WalletConnection />
  </UseWalletProvider>
);
