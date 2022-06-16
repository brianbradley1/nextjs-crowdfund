import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "../routes";
import { MoralisProvider } from "react-moralis";
import WalletConnection from "../ethereum/WalletConnection";

const Header = (props) => {
  return (
    <MoralisProvider initializeOnMount={false}>
      <AppBar color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link route="/">
            <a className="item" style={{ color: "white" }}>
              Crowdfund
            </a>
          </Link>
          <div style={{ marginLeft: "auto" }}>
            <WalletConnection />
          </div>
        </Toolbar>
      </AppBar>
    </MoralisProvider>
  );
};
export default Header;
