import React from "react";
import { AppBar, Toolbar, IconButton, Button } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "../routes";
import WalletConnection from "../ethereum/WalletConnection";

const Header = (props) => {
  return (
    <AppBar color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link route="/">
          <a className="item" style={{ color: "white" }}>
            Crowdfund
          </a>
        </Link>
        {/* <IconButton>
          <MenuIcon />
        </IconButton> */}
        <div style={{ marginLeft: "auto" }}>
          <WalletConnection />
        </div>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
