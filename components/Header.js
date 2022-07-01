import { ConnectButton } from "web3uikit"
import { AppBar, Toolbar } from "@mui/material";
import Link from "next/link";

export default function Header() {
    return (
        <AppBar color="primary">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Link href="/">
                        Crowdfund
                </Link>
                    <ConnectButton moralisAuth={false} />
            </Toolbar>
        </AppBar>
    )
}
